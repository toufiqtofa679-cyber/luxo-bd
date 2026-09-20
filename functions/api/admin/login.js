export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, password } = await request.json();
    
    let adminData = await env.LUXO_ADMIN_KV.get(email, { type: "json" });
    
    if (!adminData && email === "admin@luxobd.com" && password === "luxo1234") {
      adminData = { email, password, token_version: 1 };
      await env.LUXO_ADMIN_KV.put(email, JSON.stringify(adminData));
    }

    if (!adminData || adminData.password !== password) {
      return Response.json({ error: "Invalid credentials!" }, { status: 401 });
    }

    const tokenPayload = JSON.stringify({ email: adminData.email, token_version: adminData.token_version, time: Date.now() });
    return Response.json({ token: tokenPayload, message: "Login successful!" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
