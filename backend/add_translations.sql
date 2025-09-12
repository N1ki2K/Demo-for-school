-- Add translations for achievement section titles
INSERT OR REPLACE INTO translations (id, key_path, text_bg, text_en, category, description)
VALUES 
  ('historyPage.achievements.title', 'historyPage.achievements.title', 'Наши постижения', 'Our Achievements', 'ui', 'Section title for achievements'),
  ('historyPage.directors.title', 'historyPage.directors.title', 'Директори', 'Directors', 'ui', 'Section title for directors'),
  ('achievements.loading', 'achievements.loading', 'Зареждане на постижения...', 'Loading achievements...', 'ui', 'Loading message'),
  ('achievements.noAchievements.title', 'achievements.noAchievements.title', 'Няма добавени постижения.', 'No achievements added yet.', 'ui', 'Empty state title'),
  ('achievements.noAchievements.subtitle', 'achievements.noAchievements.subtitle', 'Използвайте CMS Dashboard за да добавите постижения.', 'Use the CMS Dashboard to add achievements.', 'ui', 'Empty state subtitle'),
  ('directors.loading', 'directors.loading', 'Зареждане на директори...', 'Loading directors...', 'ui', 'Loading message'),
  ('directors.noDirectors.title', 'directors.noDirectors.title', 'Няма добавени директори.', 'No directors added yet.', 'ui', 'Empty state title'),
  ('directors.noDirectors.subtitle', 'directors.noDirectors.subtitle', 'Информацията за директорите ще се показва тук.', 'Information about our school directors will be displayed here.', 'ui', 'Empty state subtitle');

-- Add sample English translations for first few achievements
INSERT OR REPLACE INTO translations (id, key_path, text_bg, text_en, category, description)
VALUES
  ('achievements.1.title', 'achievements.1.title', 'През учебната 1965/1966 година футболният отбор на училището е на ІІІ място в страната с треньор Атанас Бенчев', 'In the 1965/1966 academic year, the school''s football team ranked 3rd in the country with coach Atanas Benchev', 'achievements', 'Achievement 1 translation'),
  ('achievements.2.title', 'achievements.2.title', 'През учебната 1963/1964 година опитното поле на училището е  национален първенец', 'In the 1963/1964 academic year, the school''s experimental field was the national champion', 'achievements', 'Achievement 2 translation'),
  ('achievements.4.title', 'achievements.4.title', 'През 1972г. с Указ №1055/19.05.1972г. на ДС на НРБ във връзка със 100 годишнината от създаването, училището е наградено с орден "Кирил и Методий" - І степен', 'In 1972, by Decree No. 1055/19.05.1972 of the State Council of the People''s Republic of Bulgaria in connection with the 100th anniversary of its creation, the school was awarded the Order of ''Cyril and Methodius'' - 1st degree', 'achievements', 'Achievement 4 translation');