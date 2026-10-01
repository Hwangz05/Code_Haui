/**
 * Dịch thuật ngữ và nội dung đề bài LeetCode sang Tiếng Việt (Tối ưu tốc độ cao kèm Cache)
 */

// Bộ từ điển thuật ngữ CNTT chuẩn cho các bài phổ biến
const TECH_TERMS = {
  'Example': 'Ví dụ',
  'Input': 'Đầu vào (Input)',
  'Output': 'Đầu ra (Output)',
  'Explanation': 'Giải thích',
  'Constraints': 'Ràng buộc & Giới hạn',
  'Follow-up': 'Câu hỏi mở rộng',
  'Two Sum': 'Tìm hai số có tổng bằng Target',
  'Add Two Numbers': 'Cộng hai số biểu diễn bằng Linked List',
  'Longest Substring Without Repeating Characters': 'Chuỗi con dài nhất không chứa ký tự lặp',
  'Median of Two Sorted Arrays': 'Trung vị của hai mảng đã sắp xếp',
  'Longest Palindromic Substring': 'Chuỗi con đối xứng (Palindrome) dài nhất',
  'Valid Parentheses': 'Kiểm tra chuỗi ngoặc hợp lệ',
  'Merge Two Sorted Lists': 'Hợp nhất hai danh sách liên kết đã sắp xếp',
  'Generate Parentheses': 'Sinh các chuỗi ngoặc hợp lệ',
  'Merge k Sorted Lists': 'Hợp nhất K danh sách liên kết đã sắp xếp',
  'Search in Rotated Sorted Array': 'Tìm kiếm trong mảng xoay đã sắp xếp',
  'Combination Sum': 'Tìm tổ hợp có tổng bằng Target',
  'Trapping Rain Water': 'Hứng nước mưa (Trapping Rain Water)',
  'Permutations': 'Sinh tất cả hoán vị của mảng',
  'Rotate Image': 'Xoay ma trận ảnh 90 độ',
  'Group Anagrams': 'Gom nhóm các chuỗi đảo chữ (Anagrams)',
  'Maximum Subarray': 'Dãy con liên tiếp có tổng lớn nhất (Kadane)',
  'Climbing Stairs': 'Bài toán leo cầu thang (Fibonacci DP)',
  'Edit Distance': 'Khoảng cách biến đổi chuỗi (Levenshtein Distance)',
  'Word Search': 'Tìm từ trong ma trận ký tự',
  'Binary Tree Inorder Traversal': 'Duyệt cây nhị phân trung thứ tự (Inorder)',
};

// Bộ nhớ Cache tức thì (In-Memory Cache) để không dịch lại câu đã dịch
const memoryTranslateCache = new Map();

/**
 * Dịch một đoạn văn bản ngắn từ Tiếng Anh sang Tiếng Việt
 */
export async function translateTextToVietnamese(text) {
  if (!text || typeof text !== 'string') return text;

  const trimmed = text.trim();
  if (TECH_TERMS[trimmed]) return TECH_TERMS[trimmed];
  if (memoryTranslateCache.has(trimmed)) return memoryTranslateCache.get(trimmed);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translate status: ${res.status}`);
    const data = await res.json();
    if (data && data[0]) {
      const translated = data[0].map((item) => item[0]).join('');
      memoryTranslateCache.set(trimmed, translated);
      return translated;
    }
    return text;
  } catch (error) {
    console.warn('[translateService] Translation error, keeping original text:', error.message);
    return text;
  }
}

/**
 * Dịch toàn bộ nội dung HTML của bài toán LeetCode sang Tiếng Việt (Xử lý song song siêu tốc)
 */
export async function translateLeetCodeHtml(htmlContent, slug = '') {
  if (!htmlContent) return htmlContent;

  // 1. Kiểm tra Cache trong LocalStorage (load tức thì 0ms)
  const cacheKey = slug ? `codehaui_vi_html_${slug}` : null;
  if (cacheKey) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // 2. Tìm tất cả các đoạn văn cần dịch
    const elementsToTranslate = Array.from(doc.querySelectorAll('p, li, strong.example, font'));

    // 3. Dịch song song toàn bộ cùng 1 lúc (Promise.all) thay vì tuần tự
    await Promise.all(
      elementsToTranslate.map(async (el) => {
        const text = el.innerText || el.textContent;
        if (text && text.trim().length > 1) {
          const translated = await translateTextToVietnamese(text);
          if (translated && translated !== text) {
            el.innerText = translated;
          }
        }
      })
    );

    // 4. Chuẩn hóa các nhãn cố định
    const strongs = doc.querySelectorAll('strong');
    strongs.forEach((st) => {
      const t = st.textContent?.trim();
      if (t === 'Input:') st.textContent = 'Đầu vào:';
      if (t === 'Output:') st.textContent = 'Đầu ra:';
      if (t === 'Explanation:') st.textContent = 'Giải thích:';
      if (t === 'Constraints:') st.textContent = 'Ràng buộc:';
      if (t?.includes('Follow-up:')) st.textContent = 'Mở rộng:';
    });

    const resultHtml = doc.body.innerHTML;

    // 5. Lưu vào cache để lần sau mở lên ngay lập tức
    if (cacheKey && resultHtml) {
      try {
        localStorage.setItem(cacheKey, resultHtml);
      } catch (e) {
        // Tránh lỗi đầy bộ nhớ quota
      }
    }

    return resultHtml;
  } catch (error) {
    console.warn('[translateService] Failed to parse and translate HTML:', error);
    return htmlContent;
  }
}
