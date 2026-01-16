export const formatCurrency = (amount: number): string => {
    // نستخدم 'en-US' للحصول على أرقام إنجليزية (مثال: 150,000)
    // We use 'en-US' to get English digits (e.g., 150,000)
    const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

    // نضيف رمز العملة العربية يدوياً
    // Manually append the Arabic currency symbol
    return `${formattedNumber} د.ع`;
};
