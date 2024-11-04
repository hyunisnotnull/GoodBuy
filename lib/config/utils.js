const removeHtmlTagsAndEntities = (str) => {
    // HTML 태그 제거
    const noHtmlTags = str.replace(/<[^>]*>/g, '');
    // HTML 엔티티 제거
    return noHtmlTags.replace(/&[^;]+;/g, (entity) => {
        switch (entity) {
            case '&amp;': return '&';
            case '&lt;': return '<';
            case '&gt;': return '>';
            case '&quot;': return '"';
            case '&apos;': return "'";
            default: return entity; // 처리되지 않은 엔티티는 그대로 반환
        }
    });
};

module.exports = { removeHtmlTagsAndEntities };