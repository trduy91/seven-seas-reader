# Seven Seas Reader

Trang đọc công khai của **THE SHATTERED SEA SAGA**. Nội dung truyện được xuất bản bằng tiếng Việt.

<https://trduy91.github.io/seven-seas-reader/>

Chương đã xuất bản:
[Quyển I — Chương 1: Thước Đo Của Muối](https://trduy91.github.io/seven-seas-reader/chapters/book-01-the-crow-of-iron/chapter-001-the-measure-of-salt/).

Kho này chỉ chứa các chương đã được duyệt để độc giả theo dõi. Bản thảo, sổ theo dõi liên tục và tư liệu canon dành riêng cho tác giả vẫn được lưu trong [trduy91/seven-seas](https://github.com/trduy91/seven-seas).

## Xuất bản

1. Chuẩn bị và duyệt chương trong kho sáng tác riêng.
2. Chỉ sao chép bản đã duyệt, an toàn cho độc giả vào `_chapters/<book-slug>/`.
3. Cập nhật `_data/chapters.yml` và tạo yêu cầu hợp nhất.
4. Kiểm tra nội dung hiển thị rồi hợp nhất vào `main`.
5. GitHub Actions triển khai trang lên GitHub Pages.

Việc cập nhật kho sáng tác riêng không tự động xuất bản chương. Một chương chỉ được coi là đã xuất bản sau khi triển khai Pages thành công và URL công khai được xác minh.

## Xem trước trên máy


This is a Jekyll site. Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```

The production configuration uses the GitHub Pages project-site base path `/seven-seas-reader`. For local preview at the root URL, use:

```sh
bundle exec jekyll serve --baseurl ""
```


## Quy tắc an toàn khi cập nhật Reader

- `site/data/catalog.json` là danh mục dùng chung cho **tất cả** series. Mọi lần xuất bản phải đọc phiên bản mới nhất trên nhánh đích trước khi chỉnh sửa.
- Chỉ cập nhật mục của series đang xuất bản; phải giữ nguyên toàn bộ series và danh sách chương của các series khác.
- Không thay thế danh mục bằng một JSON chỉ chứa series đang được cập nhật. Phải hợp nhất thay đổi vào danh mục hiện tại.
- Trước khi commit, kiểm tra rằng mọi mục series/chương đã xuất bản trước đó vẫn còn, đường dẫn `file` của từng chương tồn tại và nội dung mới không ghi đè nội dung của series khác.
- Sau khi deploy, mở Reader và xác minh cả series vừa cập nhật lẫn các series đã xuất bản trước đó.
