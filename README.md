# Seven Seas Reader

Trang đọc công khai của **Seven Seas** — gồm các series truyện và những bộ tư liệu thế giới đã được chọn để công bố bằng tiếng Việt.

<https://trduy91.github.io/seven-seas-reader/>

## Nội dung đã xuất bản

- **THE SHATTERED SEA SAGA** — đã có Quyển I, các chương 1–10 (Chương 1–10). Mở Reader, chọn series để đọc theo thứ tự.
- **Nhật Ký Thực Địa của Giáo sư Sycamore** — mở trang Reader, chọn bộ sưu tập cùng tên để đọc các bài giảng. Hiện có 14 bài đã công bố, từ [Ngày 001](https://github.com/trduy91/seven-seas-reader/blob/main/site/field-notes/sycamore/day-001.md), [Ngày 002](https://github.com/trduy91/seven-seas-reader/blob/main/site/field-notes/sycamore/day-002.md), [Ngày 003](https://github.com/trduy91/seven-seas-reader/blob/main/site/field-notes/sycamore/day-003.md) đến các bài 004–013 và [Bài 014 — Rạn cạn, thảm cỏ và dòng cát](https://github.com/trduy91/seven-seas-reader/blob/main/site/field-notes/sycamore/lecture-014-ran-can-tham-co-va-dong-cat.md).

Kho này chỉ chứa nội dung đã được chọn để độc giả theo dõi. Bản thảo, sổ theo dõi liên tục và tư liệu canon dành riêng cho tác giả vẫn được lưu trong [trduy91/seven-seas](https://github.com/trduy91/seven-seas).

## Xuất bản

1. Chuẩn bị và kiểm tra nội dung canon trong kho sáng tác riêng.
2. Quy trình Sycamore tự đóng gói bài giảng reader-safe sau khi workflow ảnh hoàn tất; ảnh thật dùng raw URL từ source repository, asset thiếu giữ placeholder rõ ràng.
3. Tạo/cập nhật PR riêng, giữ nguyên mọi series và chương đã xuất bản trước đó.
4. CI kiểm tra catalog, đường dẫn chapter và ảnh local; chỉ merge khi validation thành công.
5. Sau merge, chờ Pages deployment thành công và xác minh catalog công khai chứa đúng lecture IDs trước khi ghi nhận PUBLISHED.

Việc cập nhật kho sáng tác riêng không tự động xuất bản nội dung. Một bài chỉ được coi là đã xuất bản trên Reader sau khi triển khai Pages thành công và trang công khai được xác minh.

## Xem trước trên máy

Trang Reader hiện dùng ứng dụng tĩnh trong `site/`. Có thể phục vụ thư mục này bằng máy chủ tĩnh cục bộ; đường dẫn trong `site/data/catalog.json` được tính tương đối từ `site/index.html`.

## Quy tắc an toàn khi cập nhật Reader

- `site/data/catalog.json` là danh mục dùng chung cho **tất cả** series. Mọi lần xuất bản phải đọc phiên bản mới nhất trên nhánh đích trước khi chỉnh sửa.
- Chỉ cập nhật mục của series đang xuất bản; phải giữ nguyên toàn bộ series và danh sách chương của các series khác.
- Không thay thế danh mục bằng một JSON chỉ chứa series đang được cập nhật.
- Trước khi commit, kiểm tra rằng mọi mục series/chương đã xuất bản trước đó vẫn còn và đường dẫn `file` của từng chương tồn tại.
- `scripts/validate_catalog.py` là cổng CI bắt buộc cho thay đổi Reader: kiểm tra ID, số chương, file chapter và đường dẫn ảnh local.
- Sau khi deploy, mở Reader và xác minh cả series vừa cập nhật lẫn các series đã xuất bản trước đó.


## Các trang Reader

- Thư viện: <https://trduy91.github.io/seven-seas-reader/>
- Mục lục chương theo series: `/chapters.html?story=<series-id>` — hiển thị 20 chương mỗi trang, có phân trang khi danh sách dài hơn.
- Trang đọc: `/reader.html?story=<series-id>&chapter=<chapter-index>` — có điều hướng chương trước/tiếp ở cả đầu và cuối nội dung.
