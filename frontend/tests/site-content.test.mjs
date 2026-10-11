import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultSiteContent,
  parseSiteContent,
  safeImage,
  safeLink,
} from "../src/shared/content/site-content.ts";

test("accepts bilingual content with projects and partners", () => {
  const content = structuredClone(defaultSiteContent);
  content.projects = [
    {
      id: "work-1",
      title: { ar: "عمل", en: "Work" },
      description: { ar: "", en: "" },
      category: { ar: "", en: "" },
      image: "data:image/webp;base64,AAAA",
      url: "https://example.com",
      visible: true,
    },
  ];
  content.partners = [
    { id: "partner-1", name: "Partner", image: "", url: "", visible: false },
  ];
  assert.deepEqual(parseSiteContent(JSON.stringify(content)), content);
});
test("rejects executable and malformed links and images", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "//example.com",
    "file:///private",
  ])
    assert.equal(safeLink(url), "");
  assert.equal(safeImage("data:image/svg+xml;base64,AAAA"), "");
  assert.equal(
    safeImage("data:image/webp;base64,AAAA"),
    "data:image/webp;base64,AAAA",
  );
  const content = structuredClone(defaultSiteContent);
  content.facebook = "javascript:alert(1)";
  assert.throws(() => parseSiteContent(JSON.stringify(content)));
});
test("rejects oversized content and malformed records", () => {
  assert.throws(() => parseSiteContent("x".repeat(800001)));
  assert.throws(() => parseSiteContent("null"));
  const content = structuredClone(defaultSiteContent);
  content.email = "invalid";
  assert.throws(() => parseSiteContent(JSON.stringify(content)));
  content.email = "";
  content.partners = [
    { id: "a", name: "A", image: "", url: "", visible: true },
    { id: "a", name: "B", image: "", url: "", visible: true },
  ];
  assert.throws(() => parseSiteContent(JSON.stringify(content)));
});
