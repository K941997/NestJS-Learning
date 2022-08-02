import { MigrationInterface, QueryRunner } from 'typeorm';

export class initEvDict1654744694892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO evdict (idx, word, detail) VALUES
      (2, '1-byte character code', '<C><F><I><N><Q>@1-byte character code<br />- (Tech) mã ký tự 1 bai</Q></N></I></F></C>'),
      (3, '1-byte character set', '<C><F><I><N><Q>@1-byte character set<br />- (Tech) bộ ký tự 1 bai</Q></N></I></F></C>'),
      (4, '1-byte character string', '<C><F><I><N><Q>@1-byte character string<br />- (Tech) chuỗi ký tự 1 bai</Q></N></I></F></C>'),
      (5, '1 to 1 relationship', '<C><F><I><N><Q>@1 to 1 relationship<br />- (Tech) quan hệ 1 đối 1</Q></N></I></F></C>'),
      (6, '1 to many relationship', '<C><F><I><N><Q>@1 to many relationship<br />- (Tech) quan hệ 1 đối nhiều</Q></N></I></F></C>'),
      (7, '2-way device', '<C><F><I><N><Q>@2-way device<br />- (Tech) thiết bị 2 chiều/thu phát</Q></N></I></F></C>'),
      (8, '2D configuration', '<C><F><I><N><Q>@2D configuration<br />- (Tech) cấu hình 2 chiều, cấu hình phẳng</Q></N></I></F></C>'),
      (9, '2D image', '<C><F><I><N><Q>@2D image<br />- (Tech) ảnh 2 chiều, ảnh phẳng</Q></N></I></F></C>'),
      (10, '2D module = two-dimensional module', '<C><F><I><N><Q>@2D module = two-dimensional module<br />- (Tech) mô đun hai chiều</Q></N></I></F></C>'),
      (11, '2D (two dimension)', '<C><F><I><N><Q>@2D (two dimension)<br />- (Tech) hai chiều, nhị thứ nguyên, phẳng</Q></N></I></F></C>'),
      (12, '3D (three dimension)', '<C><F><I><N><Q>@3D (three dimension)<br />- (Tech) ba chiều, tam thứ nguyên, nổi</Q></N></I></F></C>'),
      (13, '3D (three dimension) calculation', '<C><F><I><N><Q>@3D (three dimension) calculation<br />- (Tech) tính toán 3 chiều</Q></N></I></F></C>'),
      (14, '3D (three dimension) configuration', '<C><F><I><N><Q>@3D (three dimension) configuration<br />- (Tech) cấu hình 3 chiều, cấu hình nổi</Q></N></I></F></C>'),
      (15, '3D (three dimension) image', '<C><F><I><N><Q>@3D (three dimension) image<br />- (Tech) ảnh 3 chiều, ảnh nổi = stereoscopic image</Q></N></I></F></C>'),
      (16, '4th Generation Language (4GL)', '<C><F><I><N><Q>@4th Generation Language (4GL)<br />- (Tech) Ngôn ngữ Thế hệ Thứ tư</Q></N></I></F></C>'),
      (17, '7-bit ASCII code', '<C><F><I><N><Q>@7-bit ASCII code<br />- (Tech) mã ASCII 7 bít</Q></N></I></F></C>'),
      (18, '7-bit ASCII code set', '<C><F><I><N><Q>@7-bit ASCII code set<br />- (Tech) bộ mã ASCII 7 bít</Q></N></I></F></C>'),
      (19, '8-bit character', '<C><F><I><N><Q>@8-bit character<br />- (Tech) ký tự 8 bít</Q></N></I></F></C>'),
      (20, '8-bit character code', '<C><F><I><N><Q>@8-bit character code<br />- (Tech) mã ký tự 8 bít</Q></N></I></F></C>'),
      (21, '8-bit character set', '<C><F><I><N><Q>@8-bit character set<br />- (Tech) bộ ký tự 8 bít</Q></N></I></F></C>'),
      (22, '8-bit character string', '<C><F><I><N><Q>@8-bit character string<br />- (Tech) chuỗi ký tự 8 bít</Q></N></I></F></C>'),
      (23, '8-bit microcomputer', '<C><F><I><N><Q>@8-bit microcomputer<br />- (Tech) máy vi điện toán 8 bít, máy vi tính 8 bít [TN]</Q></N></I></F></C>'),
      (24, '8-bit microprocessor', '<C><F><I><N><Q>@8-bit microprocessor<br />- (Tech) bộ vi xử lý 8 bít</Q></N></I></F></C>'),
      (25, '8-bit personal computer', '<C><F><I><N><Q>@8-bit personal computer<br />- (Tech) máy điện toán cá nhân 8 bít</Q></N></I></F></C>'),
      (26, 'a', '<C><F><I><N><Q>@a /ei, ə/<br />  danh từ,  số nhiều as,  a''s<br />- (thông tục) loại a, hạng nhất, hạng tốt nhất hạng rất tốt<br />=his health is a+ sức khoẻ anh ta vào loại a<br />- (âm nhạc) la<br />=a sharp+ la thăng<br />=a flat+ la giáng<br />- người giả định thứ nhất; trường hợp giả định thứ nhất<br />=from a to z+ từ đầu đến đuôi, tường tận<br />=not to know a from b+ không biết tí gì cả; một chữ bẻ đôi cũng không biết<br />  mạo từ<br />- một; một (như kiểu); một (nào đó)<br />=a very cold day+ một ngày rất lạnh<br />=a dozen+ một tá<br />=a few+ một ít<br />=all of a size+ tất cả cùng một cỡ<br />=a Shakespeare+ một (văn hào như kiểu) Sếch-xpia<br />=a Mr Nam+ một ông Nam (nào đó)<br />- cái, con, chiếc, cuốn, người, đứa...;<br />=a cup+ cái chén<br />=a knife+ con dao<br />=a son of the Party+ người con của Đảng<br />=a Vietnamese grammar+ cuốn ngữ pháp Việt Nam<br />*  giới từ<br />- mỗi, mỗi một<br />=twice a week+ mỗi tuần hai lần<br /><br />@a/c<br />- (vt của account current) tài khoản vãng lai (tức là bằng séc)<br />- có nghĩa giống như nghĩa của account</Q></N></I></F></C>'),
      (27, 'A A', '<C><F><I><N><Q>@aa<br />- (Alcoholics Anonymous) Hội cai rượu<br />- (Automobile Association) Hội ô tô</Q></N></I></F></C>'),
      (28, 'A A A', '<C><F><I><N><Q>@aaa<br />- (Amateur Athletic Association) Hội thể thao không chuyên<br />- (American Automobile Association) Hiệp hội xe hơi Mỹ</Q></N></I></F></C>'),
      (29, 'a b c', '<C><F><I><N><Q>@a b c /''eibi:''si:/<br />*  danh từ<br />- bảng chữ cái<br />- khái niệm cơ sở, cơ sở<br />=a_b_c of chemistry+ khái niệm cơ sở về hoá học, cơ sở hoá học<br />- (ngành đường sắt) bảng chỉ đường theo abc</Q></N></I></F></C>'),
      (30, 'a b c - book', '<C><F><I><N><Q>@a b c - book /''eibi:''si:buk/<br />*  danh từ<br />- sách vỡ lòng, sách học vần</Q></N></I></F></C>'),
      (31, 'a-bomb', '<C><F><I><N><Q>@a-bomb /''ei''bɔm/<br />*  danh từ<br />- bom nguyên tử</Q></N></I></F></C>'),
      (32, 'A-D', '<C><F><I><N><Q>@A-D = A/D = a-d (analog-to-digital)<br />- (Tech) đổi  dạng sóng (dạng tương tự) sang dạng số</Q></N></I></F></C>'),
      (33, 'a.d.', '<C><F><I><N><Q>@a.d. /''ei''di:/<br />*  (viết tắt) của Ano Domin<br />- sau công nguyên<br />=1540 a.d.+ năm 1540 sau công nguyên</Q></N></I></F></C>'),
      (34, 'a.d.c', '<C><F><I><N><Q>@a.d.c<br />- (vt của aide-de-camp) sự quan phụ tá</Q></N></I></F></C>'),
      (35, 'A-D conversion', '<C><F><I><N><Q>@A-D conversion<br />- (Tech) đổi sóng (tương tự) - số</Q></N></I></F></C>'),
      (36, 'A-D converter circuit', '<C><F><I><N><Q>@A-D converter circuit<br />- (Tech) mạch đổi sóng-số</Q></N></I></F></C>'),
      (37, 'A except B gate', '<C><F><I><N><Q>@A except B gate<br />- (Tech) cổng A loại trừ B</Q></N></I></F></C>');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM evdict WHERE 1 = 1`);
  }
}
