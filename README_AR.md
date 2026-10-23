# Nova AI — دليل الإعداد

## نشر المشروع
1. ارفع محتويات هذا المجلد إلى مستودع GitHub مع الحفاظ على المسار `netlify/functions/chat.mjs`.
2. في Netlify اختر Add new project ثم Import an existing project واربط مستودع GitHub.
3. في إعدادات الموقع افتح Environment variables وأضف `OPENAI_API_KEY` بقيمة مفتاح API الخاص بك.
4. أضف `OPENAI_MODEL` بقيمة موديل متاح لحساب API الخاص بك؛ القيمة الافتراضية هي `gpt-4.1-mini`.
5. أعد النشر Redeploy.

مهم: اشتراك ChatGPT لا يعني بالضرورة وجود رصيد API؛ قد تحتاج إعداد فوترة منفصلة. لا تضع مفتاح API في HTML أو GitHub. هذا مشروع بداية ولم يتم نشره أو اختباره بمفتاح حقيقي.