import OpenAI from "openai";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "طريقة الطلب غير مدعومة." }), {
      status: 405, headers: { ...headers, Allow: "POST" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({
      error: "لم يتم ضبط OPENAI_API_KEY في إعدادات Netlify."
    }), { status: 500, headers });
  }

  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length || messages.length > 20) {
      return new Response(JSON.stringify({ error: "أرسل رسالة أو محادثة قصيرة." }), {
        status: 400, headers,
      });
    }

    const safeMessages = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-16)
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));

    if (!safeMessages.length || !safeMessages.some(m => m.role === "user")) {
      return new Response(JSON.stringify({ error: "الرسالة فارغة أو غير صالحة." }), {
        status: 400, headers,
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions: "أنت Nova AI، مساعد مفيد وودود. أجب بلغة المستخدم، ويفضل الدارجة المغربية أو العربية إذا كتب بها. كن واضحا وصادقا ولا تدّع أنك ChatGPT الرسمي.",
      input: safeMessages,
      max_output_tokens: 900,
    });

    return new Response(JSON.stringify({ reply: response.output_text || "لم أتمكن من إنشاء رد." }), {
      status: 200, headers,
    });
  } catch (error) {
    console.error("Nova AI request failed:", error?.status || error?.name || "unknown");
    const status = error?.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({
      error: status === 429
        ? "تم تجاوز حد الاستخدام أو لا يوجد رصيد كافٍ في حساب API."
        : "تعذر الاتصال بخدمة الذكاء الاصطناعي. راجع مفتاح API واسم النموذج في إعدادات Netlify."
    }), { status, headers });
  }
};
