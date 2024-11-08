// HTML 태그 제거 MODULE
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

// 텍스트 필터링 MODULE
const badWords = [
    "술", "소주", "맥주", "위스키",
    "담배", 
    "마약", "약", 
    "현금", 
    "신분증", "민증", "주민번호",
    "www\\.", "\\.com",
];

const regex = new RegExp(`(^|\\s)(${badWords.join("|")})(\\s|$)`, "i");
const domainRegex = /(https?:\/\/)?(www\.)?[a-z0-9-]+\.[a-z]{2,}/i;

const censorBadWords = (text) => {
    if (typeof text !== 'string') {
        return text;
    }
    
    let censoredText = text.replace(regex, '*****');
    censoredText = censoredText.replace(domainRegex, '*****');

    return censoredText;
};

function isValidItemDescription(description) {
    const hasBadWords = regex.test(description) || domainRegex.test(description);
    return !hasBadWords;
}

module.exports = { removeHtmlTagsAndEntities, isValidItemDescription, censorBadWords };