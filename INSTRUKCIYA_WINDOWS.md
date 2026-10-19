# Як розмістити MYSTERYUM WALLET у Google Play та App Store (Windows 11)

Проста інструкція без технічних термінів. Виконуйте кроки по порядку.

---

## ЧАСТИНА 1. Google Play (Android) — робиться на вашому Windows

### Крок 1. Купіть акаунт розробника Google Play
1. Відкрийте https://play.google.com/console
2. Увійдіть у свій Google-акаунт
3. Оплатіть $25 (одноразово, назавжди)
4. Заповніть дані: ім'я видавця — **MYSTERYUM WALLET**, email — **support@mysteryum.com**

### Крок 2. Встановіть Android Studio
1. Завантажте з https://developer.android.com/studio (кнопка Download)
2. Встановіть як звичайну програму (Next → Next → Install)
3. При першому запуску оберіть «Standard» установку і дочекайтеся завантаження

### Крок 3. Отримайте проєкт на комп'ютер (найпростіший шлях)
1. Завантажте файл **архів проєкту** з чату (я прикріпив його нижче)
2. Розпакуйте його у зручну папку, наприклад `C:\MYSTERYUM` — всередині буде папка `android`
3. Якщо бажаєте вести проєкт через GitHub (необов'язково для Google Play) — дивіться кроки нижче:
   - У Lovable натисніть **GitHub** (кнопка зверху) → «Connect to GitHub» → «Create repository»
   - Встановіть GitHub Desktop: https://desktop.github.com
   - У GitHub Desktop: File → Clone repository → оберіть ваш проєкт → Clone

### Крок 4. Зберіть файл для магазину
1. Відкрийте Android Studio → Open → оберіть папку `android` всередині проєкту
2. Дочекайтеся, поки програма все завантажить (внизу буде смужка прогресу, 5–15 хвилин)
3. У меню зверху: **Build → Generate Signed App Bundle / APK**
4. Оберіть **Android App Bundle (.aab)** → Next
5. Натисніть **Create new...** (це ваш ключ підпису):
   - Вкажіть папку, назву файлу (наприклад `mysteryum-key`), пароль (запишіть його!)
   - Ім'я: MYSTERYUM WALLET → OK → Next
6. Оберіть **release** → Create
7. Готовий файл буде в папці `android/app/release/app-release.aab`

⚠️ **Збережіть файл ключа і пароль у надійному місці!** Без них не зможете оновлювати додаток.

### Крок 5. Завантажте в Google Play
1. У https://play.google.com/console натисніть **Create app**
2. Назва: **MYSTERYUM WALLET**, мова: Українська, тип: App, Free
3. Заповніть розділи зліва (тексти вже готові у файлі STORE_SUBMISSION.md):
   - Опис додатка — скопіюйте з STORE_SUBMISSION.md
   - Іконка та скріншоти — зробіть скріншоти додатка на телефоні
   - Категорія: **Finance**
   - Сторінка конфіденційності: `https://mysteryum-wallet.lovable.app/privacy`
4. У розділі **Production → Create release** завантажте файл `app-release.aab`
5. Натисніть **Send for review** — перевірка займе 1–3 дні

---

## ЧАСТИНА 2. App Store (Apple) — без Mac, через хмару

Для Apple потрібен Mac, але є обхідний шлях — хмарний сервіс Codemagic, який збере додаток за вас.

### Крок 1. Купіть акаунт Apple Developer
1. Відкрийте https://developer.apple.com/programs/enroll
2. Увійдіть з Apple ID (або створіть)
3. Оплатіть $99 на рік

### Крок 2. Зареєструйтесь у Codemagic
1. Відкрийте https://codemagic.io/signup
2. Увійдіть через GitHub (той самий акаунт, де лежить проєкт)
3. Безкоштовного тарифу вистачить (500 хвилин на місяць для Mac-збірок)

### Крок 3. Налаштуйте збірку
1. У Codemagic: Add application → оберіть ваш репозиторій
2. Тип збірки: **iOS app**
3. Підключіть свій Apple Developer акаунт (Codemagic сам створить сертифікати — це найпростіша частина, все автоматично)
4. Натисніть **Start new build** і дочекайтеся (~20 хвилин)

### Крок 4. Завантажте в App Store
1. Відкрийте https://appstoreconnect.apple.com
2. My Apps → **+** → New App:
   - Назва: **MYSTERYUM WALLET**
   - Bundle ID: `com.keypowergrailmystery.wallet`
3. Заповніть опис (тексти у STORE_SUBMISSION.md), додайте скріншоти
4. Сторінка конфіденційності: `https://mysteryum-wallet.lovable.app/privacy`
5. У Codemagic після збірки натисніть **Publish to App Store Connect** — файл потрапить у ваш акаунт автоматично
6. У App Store Connect оберіть цю збірку → **Submit for Review**
7. Перевірка Apple займе 1–2 дні

---

## Що Apple і Google можуть запитати при перевірці

- **Навіщо додатку доступ до інтернету** — відповідь: для роботи з блокчейн-мережами
- **Чи є фінансові послуги** — відповідь: некастодіальний гаманець, ключі зберігаються тільки на пристрої користувача
- Apple може попросити демо-відео роботи додатка — запишіть екран телефона

## Витрати підсумок
| Що | Скільки |
|---|---|
| Google Play акаунт | $25 одноразово |
| Apple Developer | $99/рік |
| Android Studio | безкоштовно |
| Codemagic | безкоштовно (стартовий тариф) |

---

Якщо на якомусь кроці щось піде не так — напишіть мені, на якому саме, і я допоможу.
