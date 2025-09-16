# Public HTML Files - Migration from Old Site

This folder contains essential files extracted from the old Joomla-based school website that should be integrated into the new React-based site.

## 📁 Folder Structure

### `/images/`
Contains all image assets from the old site:

#### `/images/ekip/` - Team Member Photos
- `direktor.jpg` - Director's photo (162KB)
- `daniela_qneva.jpg` - Staff member photo
- `diana_belcheva.jpg` - Staff member photo
- `donka_dobreva.jpg` - Staff member photo
- `galina_petkova.jpg` - Staff member photo
- `gloria_nikolova.jpg` - Staff member photo
- `mariana_koicheva.jpg` - Staff member photo
- `maria_staneva.jpg` - Staff member photo
- `radka_todorova.jpg` - Staff member photo
- `vanq_ivanova.jpg` - Staff member photo
- `ekip.jpg` - Full team group photo (296KB)
- `prezentaciq.mp4` - School presentation video (85MB)
- `ОУ К. Ганчев Прием 2023.wmv` - 2023 admission video (17MB)

#### `/images/banners/` - Banner Images
- `osmbanner1.png` & `osmbanner2.png` - OSM banners
- `shop-ad.jpg` & `shop-ad-books.jpg` - Shop advertisements
- `white.png` - White banner template

#### `/images/Obrazovanie_za_utreshniq_den/` - Project Images
Educational project "Education for Tomorrow" images:
- `chasove_s_deca.jpg` - Classes with children
- `chas_po_digitalni_ymeniq.jpg` - Digital skills class
- `digitalni.jpg` - Digital equipment
- `komp_kabinet.jpg` - Computer cabinet
- And more project-related photos

#### `/images/` - Root Level
- `logo.png` & `logo1.png` - School logos (79KB each)
- `begin.jpg` - Beginning/welcome image (348KB)
- `kg.jpg` - Kolyo Ganchev portrait (154KB)
- `oo.jpg` - School building photo (374KB)
- `pic.jpg` - General school photo (133KB)

### `/.well-known/`
Contains SSL certificate validation files:
- `/acme-challenge/` - ACME protocol files for Let's Encrypt
- `/pki-validation/` - Public Key Infrastructure validation files

### `/.htaccess`
Apache server configuration file for redirects and security

### `/documents/`
Contains all document files from the old site organized by category:

#### `/documents/docs/` - Main Document Archive
Comprehensive collection of school documents organized by year:

**Current Documents (Root Level)**:
- `strategia.pdf` - School development strategy
- `programa.pdf` - Educational programs
- `learn_plan.pdf` - Learning plans (6MB)
- `ucheben_kalendar.pdf` - Academic calendar
- `pravilnik_OS.pdf` - Public board regulations
- `priem.pdf` & `Priem_v_parvi_klas_ychebna_2020-2021_godina.pdf` - Admission procedures
- `fruit_milk.pdf` & `fruit_milk_protokol.pdf` - EU fruit & milk program
- `grafik_direktor.pdf` - Director's schedule
- `year_plan.pdf` - Annual plans

**By Academic Year**:
- **`/2025/`** - Current year documents including curricula (УУП), schedules, admission processes
  - `/Графици, разписание и ууп/` - Schedules and curricula
  - `/Финансова грамотност 2024 2025г/` - Financial literacy program
  - `/График прием/` - Admission schedules
  - `/Етичен кодекс/` - Ethics code
- **`/2024/`** - Previous year's annual reports, class curricula, admission procedures
- **`/2023/`** - Historical documents, regulations, development strategies
- **`/2020/`** - COVID-era adaptations and remote learning procedures

**Administrative Documents**:
- `/admin/` - Administrative procedures (validation, transfers, admissions)
- `/otcheti/` - Financial and academic reports by quarters and years
- `/zdoi/` - Public information access documents (ZDOI compliance)

#### `/documents/licenses/` - Software Licenses
Legal documentation for third-party components used in the old site

## 🔄 Integration Instructions

### For Team Photos (Priority: High)
1. **Individual Staff Photos**: Copy from `/images/ekip/` to your new site's Pictures folder
2. **Team Group Photo**: Use `ekip.jpg` as the main team photo
3. **Director Photo**: Use `direktor.jpg` for the director profile

### For School Branding (Priority: High)
1. **School Logo**: Use `logo.png` or `logo1.png` as the main logo
2. **School Building**: Use `oo.jpg` for "About School" sections
3. **Patron Photo**: Use `kg.jpg` for Kolyo Ganchev patron page

### For Projects & Gallery (Priority: Medium)
1. **Project Images**: Use `/Obrazovanie_za_utreshniq_den/` images for project showcases
2. **Historical Photos**: Use `begin.jpg`, `pic.jpg` for history/gallery sections

### For SEO & Security (Priority: High)
1. **SSL Validation**: Copy `.well-known` folder to production server root
2. **Server Config**: Review and adapt `.htaccess` rules for React routing

### For Media Content (Priority: Low)
1. **Videos**: Convert `.wmv` files to web-compatible formats (MP4/WebM)
2. **Presentation**: Consider embedding `prezentaciq.mp4` in appropriate sections

### For Documents & Legal (Priority: Medium)
1. **Current Documents**: Upload key PDFs from `/documents/docs/` to new site's document management system
2. **Academic Plans**: Integrate learning plans and curricula (УУП files) into academic sections
3. **Admission Info**: Use admission procedures and schedules for enrollment pages
4. **Reports**: Set up quarterly/annual report archive from `/otcheti/` folder
5. **Public Information**: Ensure ZDOI compliance documents are accessible for transparency

## 📋 File Sizes & Optimization

### Large Files (>100KB) - Consider Optimization:
- `prezentaciq.mp4` (85MB) - Compress for web
- `ОУ К. Ганчев Прием 2023.wmv` (17MB) - Convert & compress
- `oo.jpg` (374KB) - Optimize for web
- `begin.jpg` (348KB) - Optimize for web
- `direktor.jpg` (162KB) - Optimize for web
- `kg.jpg` (154KB) - Optimize for web

### Ready for Use (<100KB):
- All staff member photos in `/ekip/`
- School logos
- Most banner images
- Project photos

## 🎯 Next Steps

1. **Immediate**: Copy staff photos to new site's Pictures folder
2. **High Priority**: Integrate school logos and main building photo
3. **Medium Priority**: Set up project galleries with existing images
4. **Medium Priority**: Upload essential documents from `/documents/docs/` to new site
5. **Security**: Deploy `.well-known` folder to production server
6. **Legal Compliance**: Set up document archive for public information access (ZDOI)
7. **Optimization**: Compress and convert large media files

---

*Created: $(date)*
*Source: well-known folder (Old Joomla site)*