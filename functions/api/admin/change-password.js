export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, newPassword } = await request.json();
    let adminData = await env.LUXO_ADMIN_KV.get(email, { type: "json" });

    if (!adminData) {
      return Response.json({ error: "Admin not found!" }, { status: 404 });
    }

    adminData.password = newPassword;
    adminData.token_version = (adminData.token_version || 1) + 1;
    await env.LUXO_ADMIN_KV.put(email, JSON.stringify(adminData));

    return Response.json({ message: "Password updated successfully! All other sessions logged out." });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
