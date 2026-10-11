import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseServices } from "./client";
import {
  defaultSiteContent,
  parseSiteContent,
  type SiteContent,
} from "@/shared/content/site-content";

export type ContentRecord = {
  content: SiteContent;
  revision: number;
  exists: boolean;
};
export function decodeRecord(
  data: { payload?: string; revision?: number } | undefined,
): ContentRecord {
  return {
    content: data?.payload
      ? parseSiteContent(data.payload)
      : structuredClone(defaultSiteContent),
    revision: data?.revision ?? 0,
    exists: !!data,
  };
}
export async function loadRecord(
  name: "draft" | "published",
): Promise<ContentRecord> {
  const snapshot = await getDoc(doc(firebaseServices().db, "site", name));
  return decodeRecord(snapshot.exists() ? snapshot.data() : undefined);
}
export function watchPublished(
  next: (content: SiteContent) => void,
  error: (error: Error) => void,
) {
  return onSnapshot(
    doc(firebaseServices().db, "site", "published"),
    (snapshot) => {
      try {
        next(
          decodeRecord(snapshot.exists() ? snapshot.data() : undefined).content,
        );
      } catch (err) {
        error(err as Error);
      }
    },
    error,
  );
}
export async function saveDraft(content: SiteContent, revision: number) {
  const payload = JSON.stringify(content);
  parseSiteContent(payload);
  const ref = doc(firebaseServices().db, "site", "draft");
  await runTransaction(firebaseServices().db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if ((snapshot.data()?.revision ?? 0) !== revision)
      throw new Error(
        "تم تعديل المسودة من جلسة أخرى. أعد تحميل البيانات قبل الحفظ.",
      );
    transaction.set(ref, {
      payload,
      revision: revision + 1,
      updatedAt: serverTimestamp(),
    });
  });
  return revision + 1;
}
export async function publishContent(
  content: SiteContent,
  draftRevision: number,
  publishedRevision: number,
) {
  const payload = JSON.stringify(content);
  parseSiteContent(payload);
  const { db } = firebaseServices();
  const draft = doc(db, "site", "draft");
  const published = doc(db, "site", "published");
  await runTransaction(db, async (transaction) => {
    const [draftSnapshot, publicSnapshot] = await Promise.all([
      transaction.get(draft),
      transaction.get(published),
    ]);
    if (
      (draftSnapshot.data()?.revision ?? 0) !== draftRevision ||
      (publicSnapshot.data()?.revision ?? 0) !== publishedRevision
    )
      throw new Error(
        "تم تغيير المحتوى من جلسة أخرى. أعد تحميل البيانات قبل النشر.",
      );
    transaction.set(draft, {
      payload,
      revision: draftRevision + 1,
      updatedAt: serverTimestamp(),
    });
    transaction.set(published, {
      payload,
      revision: publishedRevision + 1,
      updatedAt: serverTimestamp(),
    });
  });
  return {
    draftRevision: draftRevision + 1,
    publishedRevision: publishedRevision + 1,
  };
}
