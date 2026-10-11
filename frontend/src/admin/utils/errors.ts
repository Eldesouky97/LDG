export function errorText(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "auth/popup-closed-by-user")
    return "تم إغلاق نافذة تسجيل الدخول.";
  if (code === "auth/popup-blocked")
    return "اسمح بنافذة تسجيل الدخول في المتصفح ثم حاول مرة أخرى.";
  if (code === "auth/unauthorized-domain")
    return "هذا النطاق غير مضاف إلى نطاقات تسجيل الدخول المعتمدة.";
  if (code === "permission-denied")
    return "هذا الحساب لا يملك صلاحية تعديل الموقع.";
  if (code === "unavailable" || code === "auth/network-request-failed")
    return "تعذر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.";
  return error instanceof Error && !code
    ? error.message
    : "تعذر إكمال العملية. حاول مرة أخرى.";
}
