document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.sample-card');
    
    cards.forEach(card => {
        const content = card.querySelector('.sample-content');
        const description = card.querySelector('.sample-description');
        
        // محاسبه ارتفاع مورد نیاز برای توضیحات
        const descriptionHeight = description.scrollHeight;
        
        card.addEventListener('mouseenter', () => {
            // تغییر ارتفاع با انیمیشن
            content.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.height = `${60 + descriptionHeight}px`;
        });
        
        card.addEventListener('mouseleave', () => {
            // تاخیر در تغییر ارتفاع برای نمایش انیمیشن مخفی شدن توضیحات
            setTimeout(() => {
                content.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.height = '60px';
            }, 200);
        });
    });
}); 