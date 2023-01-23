# Интернет-магазин Gifty (SPA, React, TypeScript, MUI) [(live version)](https://gifty.fantasia18.repl.co/)
Интернет-магазин подарков и игрушек на TypeScript + React (frontend и backend) + Material UI в формате SPA с server-side rendering + 
собственный сервер изображений на основе sharp.
React+Redux, TypeScript, Express server, MongoDB Atlas, Webpack. MongoDB full-text search с autocomlete для поиска по сайту + 
поисковые подсказки для ввода адреса и имени пользователя (dadata api).
## Что интересного:   
**Frontend:**    
:white_check_mark: кастомный конструктор адаптивных баннеров (поддерживаются 3 различных кастомизируемых шаблона баннеров)    
:white_check_mark: кастомные горизонтальные галереи single-item (карусель баннеров) и multiple-item (список товаров)    
:white_check_mark: полноценно функционирующая система связанных фильтров, в т.ч. диапазоны цен 
с управлением слайдером или текстовым вводом с парсингом параметров из url + сортировка     
:white_check_mark: алгоритм поиска похожих и рекомендованных товаров (на основе названия, категории и цены товара)    
:white_check_mark: трехэтапная корзина на одной странице (корзина - форма оформления заказа - TYP)    
:white_check_mark: поиск по сайту с подсказками запросов и товаров + автодополнение полей формы (имя и адрес)    
:white_check_mark: личный кабинет пользователя (статистика, заказы, управление личными данными)    
:white_check_mark: MUI + MUI styled-components    
:white_check_mark: кастомизированные управляемые Yandex.Maps    
:white_check_mark: React Spring анимации и parallax-эффект     
:white_check_mark: Optimistic UI + превью плейсхолдеры для контента во время загрузки данных     
:white_check_mark: Redux state sync + React Scroll Restoration    
    
**Backend:**   
:white_check_mark: модуль авторизации (argon2, jwt, хранение токена в httpOnly signed Cookies), неявная регистрация/авторизация     
:white_check_mark: корзина, избранное и заказы хранятся в БД (MongoDB Atlas)    
:white_check_mark: кастомный мини-сервер изображений на основе sharp (конвертация изображений в нужный размер 
и формат с проверкой поддержки браузером webp)    
:white_check_mark: формирование хлебных крошек "на лету", парсинг параметров фильтрации товаров из url + 
загрузка данных из БД в едином middleware    
:white_check_mark: хранение просмотренных пользователем товаров, популярность товаров 
(на основе просмотров, добавлений в корзину и заказов)    

## Технологии   
:white_check_mark: React + Redux Toolkit    
:white_check_mark: TypeScript    
:white_check_mark: Material UI    
:white_check_mark: React Spring, sharp, react imask    
:white_check_mark: NodeJS, express server    
:white_check_mark: argon2, jwt    
:white_check_mark: MongoDB Atlas    
:white_check_mark: Yandex.Maps api, dadata api     
:white_check_mark: Webpack     
