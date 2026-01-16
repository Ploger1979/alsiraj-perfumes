
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// دالة لحذف منتج من ملف products.ts
export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'products.ts');
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // البحث عن المنتج وحذفه باستخدام Regex
        // نبحث عن كائن يحتوي على "id": ID أو id: ID
        // هذا تعبير نمطي (Regex) للبحث عن الكائن كاملاً
        // نفترض أن كل منتج يبدأ بـ { وينتهي بـ } متبوعاً بفاصلة أو ] 
        // We need to iterate and remove the object. Since updating JSON string inside TS file is hard with Regex,
        // we will try to filter it out if possible, OR use a more manual block removal.

        // الطريقة الأكثر أماناً مع بنية الملف الحالية:
        // 1. العثور على بداية كائن المنتج
        const pattern = new RegExp(`\\{\\s*(?:["']?id["']?)\\s*:\\s*${id}\\s*,`, 'g');
        const match = pattern.exec(fileContent);

        if (!match) {
            return NextResponse.json({ error: 'لم يتم العثور على المنتج' }, { status: 404 });
        }

        // نحن الآن عند بداية الكائن. نحتاج لتحديد بدايته ونهايته بدقة.
        // بما أن Regex معقد مع الأقواس المتداخلة، سنقوم بحيلة بسيطة:
        // سنبحث عن السطر الذي يحتوي الـ ID، ثم نصعد لأعلى لنشمل القوس المفتوح {
        // ثم ننزل لأسفل حتى القوس المغلق }.
        // لكن مهلاً، ملف products.ts المنتجات فيه واضحة.

        // سنقوم بتحميل الملف كـ Text، وتقسيمه إلى بلوكات { ... }
        // وإعادة تجميعه بدون البلوك الذي يحتوي الـ ID.

        // حل بديل وأقوى: 
        // قراءة الملف. فصل الجزء قبل `export const products ... [` والجزء بعده.
        // ثم استخراج نص المصفوفة، وتحويله لـ JSON (بصعوبة لأن المفاتيح غير مقتبسة أحياناً).

        // الحل العملي الحالي بناءً على التنسيق الثابت الذي نستخدمه:
        // المنتجات مضافة بشكل كتل منفصلة بأسطر جديدة.
        // سنستخدم Regex لحذف الكتل المشتبه بها.

        // regex to match: { [whitespace] id: ID, [anything until] },
        // note: use [\s\S]*? for non-greedy multiline matching
        // We match: { \s* id: ID , [\s\S]*? } ,?

        const deleteRegex = new RegExp(`\\{\\s*["']?id["']?\\s*:\\s*${id}\\s*,[\\s\\S]*?\\}(?:\\s*,)?`, 'g');

        // التحقق قبل الحذف
        if (!deleteRegex.test(fileContent)) {
            return NextResponse.json({ error: 'فشل تحديد موقع المنتج بدقة' }, { status: 500 });
        }

        let newContent = fileContent.replace(deleteRegex, '');

        // تنظيف الفواصل الزائدة إن وجدت (مثل ,,)
        newContent = newContent.replace(/,\s*,/g, ',');
        newContent = newContent.replace(/\[\s*,/g, '[');

        fs.writeFileSync(filePath, newContent, 'utf8');

        return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 });
    }
}
