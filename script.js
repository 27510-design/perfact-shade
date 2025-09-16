// DOM Elements
const mainPage = document.getElementById('main-page');
const productPage = document.getElementById('product-page');
const showProductPageBtn = document.getElementById('show-product-page');
const backToMainBtn = document.getElementById('back-to-main');
const imageUpload = document.getElementById('image-upload');
const cameraButton = document.getElementById('camera-button');
const captureButton = document.getElementById('capture-button');
const videoFeed = document.getElementById('video-feed');
const colorPickerCanvas = document.getElementById('color-picker-canvas');
const selectedColorBox = document.getElementById('selected-color-box');
const resultsContainer = document.getElementById('results-container');
const matchingFoundationsDiv = document.getElementById('matching-foundations');
const loadingSpinner = document.getElementById('loading-spinner');
const productDropdown = document.getElementById('product-dropdown');
const shadeDropdown = document.getElementById('shade-dropdown');
const selectedProductColorBox = document.getElementById('selected-product-color-box');
const alternativeFoundationsList = document.getElementById('alternative-foundations-list');
const copyMessage = document.getElementById('copy-message');
const confirmationModal = document.getElementById('confirmation-modal');
const modalTextToCopy = document.getElementById('modal-text-to-copy');
const confirmCopyBtn = document.getElementById('confirm-copy');
const cancelCopyBtn = document.getElementById('cancel-copy');
const productFilterContainer = document.getElementById('product-filter-container');
const productFilterDropdown = document.getElementById('product-filter-dropdown');
const backToStartBtn = document.getElementById('back-to-start');

const ctx = colorPickerCanvas.getContext('2d', { willReadFrequently: true });
let stream; // For storing the camera stream
let textToCopyBuffer = '';
let pickedColor = null;

// Sample foundation database
const sampleFoundations = [
    // Updated hex values based on online swatches (Sept 2025)
    // Supermom LUMI MATTE FOUNDATION
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '19C', hex: '#F1D8C9' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '21N', hex: '#E9D1BE' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '21C', hex: '#EDD3C1' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '22W', hex: '#E8C9B0' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '23N', hex: '#E3C2A9' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '23W', hex: '#DEBFA8' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '24W', hex: '#D4B393' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '25C', hex: '#CFAEA1' },
    { brand: 'Supermom', product: 'LUMI MATTE FOUNDATION', shade: '25W', hex: '#C6A487' },
    // Javin De Seoul Wink Foundation Pact
    { brand: 'Javin De Seoul', product: 'Wink Foundation Pact', shade: '19 Cover Pale', hex: '#F0D6C6' },
    { brand: 'Javin De Seoul', product: 'Wink Foundation Pact', shade: '20 Cover Vanilla', hex: '#F0DBCB' },
    { brand: 'Javin De Seoul', product: 'Wink Foundation Pact', shade: '21 Cover Ivory', hex: '#E8C9B9' },
    { brand: 'Javin De Seoul', product: 'Wink Foundation Pact', shade: '22 Cover Sand', hex: '#E1BFA9' },
    { brand: 'Javin De Seoul', product: 'Wink Foundation Pact', shade: '23 Cover Beige', hex: '#D6B49F' },
    // Cute Press Evory Snow Ultralight Foundation SPF30/PA+++
    { brand: 'Cute Press', product: 'Evory Snow Ultralight Foundation SPF30/PA+++', shade: 'P1 (Light Pink Beige)', hex: '#E7C8BB' },
    { brand: 'Cute Press', product: 'Evory Snow Ultralight Foundation SPF30/PA+++', shade: 'P2 (Pink Beige)', hex: '#E5C3B3' },
    { brand: 'Cute Press', product: 'Evory Snow Ultralight Foundation SPF30/PA+++', shade: 'N1 (Light Natural Beige)', hex: '#E3C5A9' },
    { brand: 'Cute Press', product: 'Evory Snow Ultralight Foundation SPF30/PA+++', shade: 'N2 (Natural Beige)', hex: '#DDBB9F' },
    // ESPOIR Pro Tailor Foundation Be Velvet
    { brand: 'ESPOIR', product: 'Pro Tailor Foundation Be Velvet', shade: '20 Vanilla', hex: '#E9D2BF' },
    { brand: 'ESPOIR', product: 'Pro Tailor Foundation Be Velvet', shade: '21 Ivory', hex: '#E5C3AB' },
    { brand: 'ESPOIR', product: 'Pro Tailor Foundation Be Velvet', shade: '22 Petal', hex: '#E4C3AF' },
    { brand: 'ESPOIR', product: 'Pro Tailor Foundation Be Velvet', shade: '23 Beige', hex: '#DDBEAC' },
    { brand: 'ESPOIR', product: 'Pro Tailor Foundation Be Velvet', shade: '24 Tan', hex: '#B58E78' },
    // Maybelline Fit Me Matte + Poreless Liquid Foundation
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '110 Porcelain', hex: '#F6E5D4' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '112 Natural Ivory', hex: '#F5DDC7' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '115 Ivory', hex: '#F2D8C3' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '120 Classic Ivory', hex: '#F1D6BD' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '122 Creamy Beige', hex: '#EBC4A7' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '125 Nude Beige', hex: '#E7C6A5' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '128 Warm Nude', hex: '#E8C8AE' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '130 Buff Beige', hex: '#E1BDA1' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '220 Natural Beige', hex: '#E3BFA6' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '222 True Beige', hex: '#DDBA9C' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '228 Soft Tan', hex: '#E1B999' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '230 Natural Buff', hex: '#D6AE8D' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '235 Pure Beige', hex: '#D1A582' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '238 Rich Tan', hex: '#CA9C77' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '245 Warm Honey', hex: '#B78864' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '310 Sun Beige', hex: '#D4A27A' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '320 Natural Tan', hex: '#C5916D' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '330 Toffee', hex: '#C28F6E' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '340 Cappuccino', hex: '#B27C5A' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '355 Coconut', hex: '#A16F54' },
    { brand: 'Maybelline', product: 'Fit Me Matte + Poreless Liquid Foundation', shade: '360 Mocha', hex: '#9F6D4F' },
    // SKINTIFIC Perfect Stay Velvet Matte Cushion
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '01 VANILLA', hex: '#F1E0D6' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '02 IVORY', hex: '#F0D9C8' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '03 PETAL', hex: '#EACAB8' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '03A ALMOND', hex: '#E4C3AE' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '04 BEIGE', hex: '#E1BFA9' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '05 SAND', hex: '#D8B59A' },
    { brand: 'SKINTIFIC', product: 'Perfect Stay Velvet Matte Cushion', shade: '06 TAN', hex: '#C9A283' },
    // Charmiss Charming Glow Longwear Foundation SPF50+ PA++++
    { brand: 'Charmiss', product: 'Charming Glow Longwear Foundation SPF50+ PA++++', shade: '01 IVORY', hex: '#F2DDCF' },
    { brand: 'Charmiss', product: 'Charming Glow Longwear Foundation SPF50+ PA++++', shade: '02 LIGHT BEIGE', hex: '#E6C8B4' },
    { brand: 'Charmiss', product: 'Charming Glow Longwear Foundation SPF50+ PA++++', shade: '03 MEDIUM BEIGE', hex: '#DDAF8E' },
    { brand: 'Charmiss', product: 'Charming Glow Longwear Foundation SPF50+ PA++++', shade: '04 HONEY BEIGE', hex: '#C89F7E' },
    // Y.O.U Cloud Touch Blurring Skin Tint
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'C203 Pink Sand', hex: '#F2D5C8' },
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'N402 Shell Ivory', hex: '#EECFBB' },
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'N504 Rose Vanilla', hex: '#E5C4B0' },
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'W610 Light Sand', hex: '#DDC2A9' },
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'W706 Warm Buff', hex: '#D1A98C' },
    { brand: 'Y.O.U', product: 'Cloud Touch Blurring Skin Tint', shade: 'W708 Honey Amber', hex: '#C0926D' },
    // Glad2Glow Perfect Cover Cushion
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '00 Affogato', hex: '#F4E7D9' },
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '01 Butter Cream', hex: '#F2E0CE' },
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '02 Praline', hex: '#E8D1BE' },
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '03 Custard', hex: '#E1C5AF' },
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '04 Ginger', hex: '#D9B99E' },
    { brand: 'Glad2Glow', product: 'Perfect Cover Cushion', shade: '05 Cinnamon', hex: '#C9A588' },
    // derra Glowy And Coverskin Cushion SPF 25 PA+++
    { brand: 'derra', product: 'Glowy And Coverskin Cushion SPF 25 PA+++', shade: '#00 Ivory Natural', hex: '#F3E5D8' },
    { brand: 'derra', product: 'Glowy And Coverskin Cushion SPF 25 PA+++', shade: '#01 Light Natural', hex: '#F0DDC7' },
    { brand: 'derra', product: 'Glowy And Coverskin Cushion SPF 25 PA+++', shade: '#02 Medium Natural', hex: '#E3C5AF' },
    { brand: 'derra', product: 'Glowy And Coverskin Cushion SPF 25 PA+++', shade: '#03 Sand Natural', hex: '#D6B598' },
    // barenbliss True Beauty Inside Cushion
    { brand: 'barenbliss', product: 'True Beauty Inside Cushion', shade: '#001 Porcelain', hex: '#F3DBCD' },
    { brand: 'barenbliss', product: 'True Beauty Inside Cushion', shade: '#002 Ivory', hex: '#EED0B9' },
    { brand: 'barenbliss', product: 'True Beauty Inside Cushion', shade: '#01 Light Petal Shower', hex: '#EAC5B4' },
    { group: 'barenbliss', product: 'True Beauty Inside Cushion', shade: '#02 Medium Blossom Bud', hex: '#E0B59C' },
    { brand: 'barenbliss', product: 'True Beauty Inside Cushion', shade: '#03 Beige Summer Nectar', hex: '#D4A587' },
    // CHY Cushion Matte
    { brand: 'CHY', product: 'Cushion Matte', shade: 'Y0 ผิวขาว', hex: '#F5EADF' },
    { brand: 'CHY', product: 'Cushion Matte', shade: 'Y1 ผิวขาวเหลือง', hex: '#F0DDC7' },
    { brand: 'CHY', product: 'Cushion Matte', shade: 'Y2 ผิวสองสี', hex: '#D6B598' },
    // CHY Cushion Glow
    { brand: 'CHY', product: 'Cushion Glow', shade: 'Y0 ผิวขาว', hex: '#F5EADF' },
    { brand: 'CHY', product: 'Cushion Glow', shade: 'Y1 ผิวขาวเหลือง', hex: '#F0DDC7' },
    { brand: 'CHY', product: 'Cushion Glow', shade: 'Y2 ผิวสองสี', hex: '#D6B598' },
    // 2P ORIGINAL Oh My Good Skin Cushion SPF50 PA+++
    { brand: '2P ORIGINAL', product: 'Oh My Good Skin Cushion SPF50 PA+++', shade: '01 IVORY', hex: '#F2E1D2' },
    { brand: '2P ORIGINAL', product: 'Oh My Good Skin Cushion SPF50 PA+++', shade: '02 NATURAL', hex: '#E6CBB5' },
    { brand: '2P ORIGINAL', product: 'Oh My Good Skin Cushion SPF50 PA+++', shade: '03 MEDIUM BEIGE', hex: '#DDBA9C' },
    { brand: '2P ORIGINAL', product: 'Oh My Good Skin Cushion SPF50 PA+++', shade: '04 HONEY', hex: '#D1A784' },
    // L‘oreal Paris Infallible Pro-Cover Cushion
    { brand: 'L‘oreal Paris', product: 'Infallible Pro-Cover Cushion', shade: '120 Vanilla', hex: '#F2D8C3' },
    { brand: 'L‘oreal Paris', product: 'Infallible Pro-Cover Cushion', shade: '200 Natural Buff', hex: '#E1BDA1' },
    { brand: 'L‘oreal Paris', product: 'Infallible Pro-Cover Cushion', shade: '240 Natural Beige', hex: '#E3BFA6' },
    { brand: 'L‘oreal Paris', product: 'Infallible Pro-Cover Cushion', shade: '320 Sand', hex: '#D6B598' },
    { brand: 'L‘oreal Paris', product: 'Infallible Pro-Cover Cushion', shade: '340 Golden Beige', hex: '#D1A784' },
    // The Originote High Cover Serum Cushion
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Fair', hex: '#F6E5D4' },
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Fair Beige', hex: '#F5DDC7' },
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Light Warm', hex: '#F2D8C3' },
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Light Neutral', hex: '#EECFBB' },
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Medium Neutral', hex: '#E1BDA1' },
    { brand: 'The Originote', product: 'High Cover Serum Cushion', shade: 'Tan Neutral', hex: '#D6AE8D' },
    // Gentle Colors Ai Cushion SPF50+ PA+++
    { brand: 'Gentle Colors', product: 'Ai Cushion SPF50+ PA+++', shade: '00 SNOW', hex: '#F8EBE1' },
    { brand: 'Gentle Colors', product: 'Ai Cushion SPF50+ PA+++', shade: '01 IVORY', hex: '#F3E0D1' },
    { brand: 'Gentle Colors', product: 'Ai Cushion SPF50+ PA+++', shade: '02 BEIGE', hex: '#E9D1BE' },
    { brand: 'Gentle Colors', product: 'Ai Cushion SPF50+ PA+++', shade: '03 SAND', hex: '#DEBEA3' },
    { brand: 'Gentle Colors', product: 'Ai Cushion SPF50+ PA+++', shade: '04 TOAST', hex: '#D1A784' },
    // FERBINA Premium Full Coverage Cushion SPF 50 PA+++
    { brand: 'FERBINA', product: 'Premium Full Coverage Cushion SPF 50 PA+++', shade: '00', hex: '#F5E4DC' },
    { brand: 'FERBINA', product: 'Premium Full Coverage Cushion SPF 50 PA+++', shade: '01', hex: '#EED3C2' },
    { brand: 'FERBINA', product: 'Premium Full Coverage Cushion SPF 50 PA+++', shade: '02', hex: '#E3C1A3' },
    { brand: 'FERBINA', product: 'Premium Full Coverage Cushion SPF 50 PA+++', shade: '03', hex: '#D6AB8B' },
    { brand: 'FERBINA', product: 'Premium Full Coverage Cushion SPF 50 PA+++', shade: '04', hex: '#C99B7A' },
    // Dr.PONG ACNE ACE LONGWEAR CUSHION
    { brand: 'Dr.PONG', product: 'ACNE ACE LONGWEAR CUSHION', shade: '01 LIGHT', hex: '#F6E9DF' },
    { brand: 'Dr.PONG', product: 'ACNE ACE LONGWEAR CUSHION', shade: '1.5 NUDE', hex: '#F1DBC9' },
    { brand: 'Dr.PONG', product: 'ACNE ACE LONGWEAR CUSHION', shade: '02 MEDIUM', hex: '#E6C8B4' },
    { brand: 'Dr.PONG', product: 'ACNE ACE LONGWEAR CUSHION', shade: '03 HONEY', hex: '#DDAF8E' },
    { brand: 'Dr.PONG', product: 'ACNE ACE LONGWEAR CUSHION', shade: '04 SAND', hex: '#D1A784' },
    // ETUDE Cloud Filter Cushion
    { brand: 'ETUDE', product: 'Cloud Filter Cushion', shade: 'Fair', hex: '#F5E6DD' },
    { brand: 'ETUDE', product: 'Cloud Filter Cushion', shade: 'Porcelain', hex: '#F1DDCB' },
    { brand: 'ETUDE', product: 'Cloud Filter Cushion', shade: 'Ivory', hex: '#E9D1BE' },
    { brand: 'ETUDE', product: 'Cloud Filter Cushion', shade: 'Beige', hex: '#E1C5AF' },
    // SRICHAND Rise & Shine Semi Matte Cushion
    { brand: 'SRICHAND', product: 'Rise & Shine Semi Matte Cushion', shade: 'P10 Pinkish', hex: '#F0D1C0' },
    { brand: 'SRICHAND', product: 'Rise & Shine Semi Matte Cushion', shade: 'N10 Natural', hex: '#E6C9B0' },
    { brand: 'SRICHAND', product: 'Rise & Shine Semi Matte Cushion', shade: 'Y20 Beige', hex: '#E0BA9C' },
    { brand: 'SRICHAND', product: 'Rise & Shine Semi Matte Cushion', shade: 'Y30 Honey', hex: '#B88B69' },
    // FIIT True Skin Cushion SPF 50+ PA+++
    { brand: 'FIIT', product: 'True Skin Cushion SPF 50+ PA+++', shade: '01 MILK FOAM', hex: '#F8E8DF' },
    { brand: 'FIIT', product: 'True Skin Cushion SPF 50+ PA+++', shade: '02 ICED CAPPUCCINO', hex: '#F0D4BE' },
    { brand: 'FIIT', product: 'True Skin Cushion SPF 50+ PA+++', shade: '03 COOL CARAMEL', hex: '#E4BEA7' },
    { brand: 'FIIT', product: 'True Skin Cushion SPF 50+ PA+++', shade: '04 ALMOND MILK', hex: '#D8AB8D' },
    // Mille Perfect Matte Long Wear Cushion SPF50 PA+++ (Added based on user request)
    { brand: 'Mille', product: 'Perfect Matte Long Wear Cushion SPF50 PA+++', shade: '01 Light', hex: '#F4E7D9' },
    { brand: 'Mille', product: 'Perfect Matte Long Wear Cushion SPF50 PA+++', shade: '02 Natural', hex: '#E8D1BE' },
    { brand: 'Mille', product: 'Perfect Matte Long Wear Cushion SPF50 PA+++', shade: '2.5 Beige', hex: '#D9C0A7' },
    // CLIO KILL COVER MESH GLOW CUSHION SPF50+ PA++++ (Added from image analysis)
    { brand: 'CLIO', product: 'KILL COVER MESH GLOW CUSHION SPF50+ PA++++', shade: '02 Lingerie', hex: '#E8D0C4' },
    { brand: 'CLIO', product: 'KILL COVER MESH GLOW CUSHION SPF50+ PA++++', shade: '03 Linen', hex: '#E5C4B4' },
    { brand: 'CLIO', product: 'KILL COVER MESH GLOW CUSHION SPF50+ PA++++', shade: '04 Ginger', hex: '#D4B8A6' },
    // 3CE Fitting Mesh Cover Cushion (Added from image analysis)
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'P01 (Fair, Cool)', hex: '#EBD1C6' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'N01 (Light, Neutral)', hex: '#F3E1D4' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'N1.5 (Medium, Neutral)', hex: '#EEC6AF' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'N02 (Medium, Neutral)', hex: '#E8C5A9' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'N03 (Tan, Neutral)', hex: '#DDC2A5' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'W01 (Light, Warm)', hex: '#F0E5D7' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'W04 (Medium, Warm)', hex: '#C6A188' },
    { brand: '3CE', product: 'Fitting Mesh Cover Cushion', shade: 'W05 (Tan, Warm)', hex: '#C1937A' },
    // Fleen Beauty Youth Up Aqua Covering Pact Cushion SPF50 PA+++ (Added from image analysis)
    { brand: 'Fleen Beauty', product: 'Youth Up Aqua Covering Pact Cushion SPF50 PA+++', shade: '01 AURA', hex: '#F5E4D4' },
    { brand: 'Fleen Beauty', product: 'Youth Up Aqua Covering Pact Cushion SPF50 PA+++', shade: '1.5 IVORY', hex: '#E7D1C1' },
    { brand: 'Fleen Beauty', product: 'Youth Up Aqua Covering Pact Cushion SPF50 PA+++', shade: '02 HEALTHY', hex: '#E6C6B0' },
    { brand: 'Fleen Beauty', product: 'Youth Up Aqua Covering Pact Cushion SPF50 PA+++', shade: '03 ALMOND', hex: '#D1A893' },
    // SOE CUSHION Radiant White Glow Cushion (New addition)
    { brand: 'SOE', product: 'Radiant White Glow Cushion', shade: '01 Porcelain Ivory', hex: '#F8F1EA' },
    { brand: 'SOE', product: 'Radiant White Glow Cushion', shade: '02 Light Vanilla', hex: '#F3E9D2' },
    { brand: 'SOE', product: 'Radiant White Glow Cushion', shade: '03 Classic Beige', hex: '#E7CCB8' },
    { brand: 'SOE', product: 'Radiant White Glow Cushion', shade: '04 Golden Sand', hex: '#D7B49B' },
    { brand: 'SOE', product: 'Radiant White Glow Cushion', shade: '05 Caramel Glow', hex: '#C89C79' },
    // MILABELLE RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++ (New addition)
    { brand: 'MILABELLE', product: 'RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++', shade: 'B10 light', hex: '#F4E7D9' },
    { brand: 'MILABELLE', product: 'RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++', shade: 'B20 medium', hex: '#E9D0BD' },
    { brand: 'MILABELLE', product: 'RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++', shade: 'B30 sand', hex: '#D6B49F' },
    { brand: 'MILABELLE', product: 'RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++', shade: 'B00 pearl', hex: '#F0DDC7' },
    { brand: 'MILABELLE', product: 'RADIANT SKIN GLOW CUSHION FOUNDATION SPF 50 PA+++', shade: 'B25 Beige', hex: '#E1C2A5' },
];

let groupedFoundations = {};
let uniqueProducts = new Set();

document.addEventListener('DOMContentLoaded', () => {
    // Group foundations by brand and product
    sampleFoundations.forEach(f => {
        const productKey = `${f.brand} ${f.product}`;
        if (!groupedFoundations[productKey]) {
            groupedFoundations[productKey] = [];
        }
        groupedFoundations[productKey].push(f);
        uniqueProducts.add(productKey);
    });
    
    // Populate product dropdown for main page
    Array.from(uniqueProducts).sort().forEach(productName => {
        const option = document.createElement('option');
        option.value = productName;
        option.textContent = productName;
        productFilterDropdown.appendChild(option);
    });

    // Populate product dropdown for product page
    Array.from(uniqueProducts).sort().forEach(productName => {
        const option = document.createElement('option');
        option.value = productName;
        option.textContent = productName;
        productDropdown.appendChild(option);
    });
});

// Function to show modal
function showModal(message, isCopy = false) {
    modalTextToCopy.textContent = message;
    if (isCopy) {
        textToCopyBuffer = message;
    }
    confirmationModal.classList.remove('hidden');
}

// Function to switch pages
function showPage(pageId) {
    mainPage.classList.add('hidden');
    productPage.classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

showProductPageBtn.addEventListener('click', () => {
    // Stop camera if running
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoFeed.style.display = 'none';
        captureButton.style.display = 'none';
    }
    showPage('product-page');
    colorPickerCanvas.style.display = 'none';
    resultsContainer.classList.add('hidden');
    shadeDropdown.disabled = true;
    document.getElementById('product-results-container').classList.add('hidden');
});

backToMainBtn.addEventListener('click', () => {
    showPage('main-page');
});

// Event listener for the new back button in the results view
backToStartBtn.addEventListener('click', () => {
    // Stop camera stream if it exists
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    // Hide media elements and results
    videoFeed.classList.add('hidden');
    colorPickerCanvas.classList.add('hidden');
    captureButton.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    // Reset the file input so the user can re-upload the same file if they wish
    imageUpload.value = '';
    
    // Reset picked color state
    pickedColor = null;
});

// Event listener for product dropdown (Product Page)
productDropdown.addEventListener('change', (event) => {
    const selectedProductKey = event.target.value;
    shadeDropdown.innerHTML = '<option value="" disabled selected>เลือกเฉดสี</option>';
    shadeDropdown.disabled = false;
    
    if (groupedFoundations[selectedProductKey]) {
        groupedFoundations[selectedProductKey].forEach(shadeData => {
            const option = document.createElement('option');
            option.value = shadeData.hex;
            option.textContent = shadeData.shade;
            shadeDropdown.appendChild(option);
        });
    }
    document.getElementById('product-results-container').classList.add('hidden');
});

// Event listener for shade dropdown (Product Page)
shadeDropdown.addEventListener('change', (event) => {
    const selectedHex = event.target.value;
    selectedProductColorBox.style.backgroundColor = selectedHex;
    document.getElementById('product-results-container').classList.remove('hidden');
    findAlternativeProducts(productDropdown.value, selectedHex);
});

// Event listener for image upload
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        videoFeed.style.display = 'none';
        captureButton.style.display = 'none';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 350;
                let newWidth = img.width;
                let newHeight = img.height;
                
                if (newWidth > maxWidth) {
                    newHeight = newHeight * (maxWidth / newWidth);
                    newWidth = maxWidth;
                }

                colorPickerCanvas.width = newWidth;
                colorPickerCanvas.height = newHeight;
                ctx.clearRect(0, 0, colorPickerCanvas.width, colorPickerCanvas.height);
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                colorPickerCanvas.style.display = 'block';
                resultsContainer.classList.add('hidden');
                productFilterContainer.classList.add('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Event listener for camera access
cameraButton.addEventListener('click', async () => {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        loadingSpinner.style.display = 'block';
        colorPickerCanvas.style.display = 'none';
        resultsContainer.classList.add('hidden');
        productFilterContainer.classList.add('hidden');
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });

        videoFeed.srcObject = stream;
        videoFeed.style.display = 'block';
        captureButton.style.display = 'block';
        loadingSpinner.style.display = 'none';
    } catch (err) {
        console.error('ไม่สามารถเข้าถึงกล้องได้:', err);
        // Custom modal for errors
        showModal('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาตใช้งานกล้อง', false);
        loadingSpinner.style.display = 'none';
    }
});

// Event listener for capturing photo
captureButton.addEventListener('click', () => {
    colorPickerCanvas.width = videoFeed.videoWidth;
    colorPickerCanvas.height = videoFeed.videoHeight;
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoFeed, -colorPickerCanvas.width, 0, colorPickerCanvas.width, colorPickerCanvas.height);
    ctx.restore();

    videoFeed.style.display = 'none';
    captureButton.style.display = 'none';
    
    colorPickerCanvas.style.display = 'block';
    productFilterContainer.classList.add('hidden');
});

// Mousemove event to draw a sampling box
colorPickerCanvas.addEventListener('mousemove', (event) => {
    if (!colorPickerCanvas.classList.contains('hidden')) {
        const rect = colorPickerCanvas.getBoundingClientRect();
        const scaleX = colorPickerCanvas.width / rect.width;
        const scaleY = colorPickerCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        ctx.clearRect(0, 0, colorPickerCanvas.width, colorPickerCanvas.height);
        ctx.drawImage(colorPickerCanvas, 0, 0, colorPickerCanvas.width, colorPickerCanvas.height);

        const sampleSize = 5;
        const halfSize = Math.floor(sampleSize / 2);
        
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - halfSize, y - halfSize, sampleSize, sampleSize);
    }
});

// Click event to average color from a sampled area
colorPickerCanvas.addEventListener('click', (event) => {
    const rect = colorPickerCanvas.getBoundingClientRect();
    const scaleX = colorPickerCanvas.width / rect.width;
    const scaleY = colorPickerCanvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    const sampleSize = 5;
    const halfSize = Math.floor(sampleSize / 2);

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let pixelCount = 0;

    for (let y = 0; y < sampleSize; y++) {
        for (let x = 0; x < sampleSize; x++) {
            const sampleX = clickX - halfSize + x;
            const sampleY = clickY - halfSize + y;
            
            if (sampleX >= 0 && sampleX < colorPickerCanvas.width &&
                sampleY >= 0 && sampleY < colorPickerCanvas.height) {
                const pixelData = ctx.getImageData(sampleX, sampleY, 1, 1).data;
                sumR += pixelData[0];
                sumG += pixelData[1];
                sumB += pixelData[2];
                pixelCount++;
            }
        }
    }

    if (pixelCount > 0) {
        const r = Math.round(sumR / pixelCount);
        const g = Math.round(sumG / pixelCount);
        const b = Math.round(sumB / pixelCount);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

        pickedColor = { r, g, b, hex };
        selectedColorBox.style.backgroundColor = hex;
        resultsContainer.classList.remove('hidden');
        productFilterContainer.classList.remove('hidden');

        // Display all matches initially
        findMatchingFoundation(null);
    }
});

// Event listener for product filter dropdown
productFilterDropdown.addEventListener('change', (event) => {
    const selectedProduct = event.target.value;
    findMatchingFoundation(selectedProduct);
});

// Function to show modal and handle copy
function showConfirmationModal(text) {
    modalTextToCopy.textContent = text;
    textToCopyBuffer = text;
    confirmationModal.classList.remove('hidden');
}

// Event listener for confirm button in modal
confirmCopyBtn.addEventListener('click', () => {
    copyToClipboard(textToCopyBuffer);
    confirmationModal.classList.add('hidden');
});

// Event listener for cancel button in modal
cancelCopyBtn.addEventListener('click', () => {
    confirmationModal.classList.add('hidden');
});

// Function to copy text
function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    copyMessage.textContent = 'คัดลอกแล้ว!';
    copyMessage.classList.remove('hidden');
    copyMessage.style.opacity = '1';
    setTimeout(() => {
        copyMessage.style.opacity = '0';
        setTimeout(() => copyMessage.classList.add('hidden'), 500);
    }, 2000);
}

// --- Color conversion and Delta E calculation functions ---
// Reference white point (D65)
const D65 = { X: 95.047, Y: 100, Z: 108.883 };

// Function to convert sRGB to XYZ
function sRGBtoXYZ(r, g, b) {
    const sRGBtoLinear = (c) => {
        c /= 255;
        return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
    };

    const R = sRGBtoLinear(r);
    const G = sRGBtoLinear(g);
    const B = sRGBtoLinear(b);

    const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
    const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    return { X: X * 100, Y: Y * 100, Z: Z * 108.883 };
}

// Function to convert XYZ to CIELAB
function XYZtoLab(X, Y, Z) {
    const f = (t) => t > Math.pow(6 / 29, 3) ? Math.cbrt(t) : t / (3 * Math.pow(6 / 29, 2)) + 4 / 29;

    const L = 116 * f(Y / D65.Y) - 16;
    const a = 500 * (f(X / D65.X) - f(Y / D65.Y));
    const b = 200 * (f(Y / D65.Y) - f(Z / D65.Z));

    return { L, a, b };
}

// Function to calculate Delta E (CIEDE2000)
function deltaE00(lab1, lab2) {
    const kL = 1, kC = 1, kH = 1;
    const { L: L1, a: a1, b: b1 } = lab1;
    const { L: L2, a: a2, b: b2 } = lab2;

    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);

    const dL = L2 - L1;
    const dC = C2 - C1;

    const h1 = Math.atan2(b1, a1);
    const h2 = Math.atan2(b2, a2);
    const dH = Math.sqrt((a1 - a2) * (a1 - a2) + (b1 - b2) * (b1 - b2) - dC * dC);

    const avgL = (L1 + L2) / 2;
    const avgC = (C1 + C2) / 2;

    const dH2 = (a1 * b2) - (a2 * b1);
    const dH_radians = dH2 > 0 ? Math.acos((a1 * a2 + b1 * b2) / (C1 * C2)) : -Math.acos((a1 * a2 + b1 * b2) / (C1 * C2));
    const avgH = (h1 + h2 + (Math.abs(h1 - h2) > Math.PI ? Math.PI : 0)) / 2;

    const T = 1 - 0.17 * Math.cos(avgH - 30 * Math.PI / 180) + 0.24 * Math.cos(2 * avgH) + 0.32 * Math.cos(3 * avgH + 6 * Math.PI / 180) - 0.20 * Math.cos(4 * avgH - 63 * Math.PI / 180);

    const dL_prime = dL / kL;
    const dC_prime = dC / kC;
    const dH_prime = dH / kH;
    
    const SL = 1 + 0.015 * Math.pow(avgL - 50, 2) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
    const SC = 1 + 0.045 * avgC;
    const SH = 1 + 0.015 * avgC * T;
    
    const RT = -2 * Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))) * Math.sin(60 * Math.PI / 180 * Math.exp(-Math.pow((avgH * 180 / Math.PI - 275) / 25, 2)));

    const dE2 = Math.pow(dL / SL, 2) + Math.pow(dC / SC, 2) + Math.pow(dH / SH, 2) + RT * (dC / SC) * (dH / SH);
    return Math.sqrt(dE2);
}

// Main function to find matching foundations from an image
function findMatchingFoundation(selectedProduct = null) {
    if (!pickedColor) {
        matchingFoundationsDiv.innerHTML = `<p class="text-xs text-gray-500 text-center">กรุณาเลือกสีผิวจากรูปภาพก่อน</p>`;
        return;
    }

    let filteredFoundations = sampleFoundations;
    if (selectedProduct) {
        filteredFoundations = sampleFoundations.filter(f => `${f.brand} ${f.product}` === selectedProduct);
    }

    if (filteredFoundations.length === 0) {
        matchingFoundationsDiv.innerHTML = `
            <p class="text-xs text-gray-500 text-center">ไม่พบรองพื้นสำหรับผลิตภัณฑ์ที่เลือกในฐานข้อมูลตัวอย่าง</p>
        `;
        return;
    }

    const selectedXYZ = sRGBtoXYZ(pickedColor.r, pickedColor.g, pickedColor.b);
    const selectedLab = XYZtoLab(selectedXYZ.X, selectedXYZ.Y, selectedXYZ.Z);

    const matchesWithDistance = filteredFoundations.map(foundation => {
        const hex = foundation.hex;
        const fr = parseInt(hex.slice(1, 3), 16);
        const fg = parseInt(hex.slice(3, 5), 16);
        const fb = parseInt(hex.slice(5, 7), 16);

        const foundationXYZ = sRGBtoXYZ(fr, fg, fb);
        const foundationLab = XYZtoLab(foundationXYZ.X, foundationXYZ.Y, foundationXYZ.Z);

        const distance = deltaE00(selectedLab, foundationLab);
        return { ...foundation, distance };
    });

    matchesWithDistance.sort((a, b) => a.distance - b.distance);
    
    matchingFoundationsDiv.innerHTML = '';
    
    if (matchesWithDistance.length > 0) {
        const closestMatch = matchesWithDistance[0];
        const otherMatches = matchesWithDistance.slice(1);
        
        let matchHtml = `
            <h3 class="text-lg font-medium mb-3 text-stone-700 text-left">ผลิตภัณฑ์ที่ใกล้เคียงที่สุด</h3>
            <div id="closest-match-card" class="info-box p-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6 card-with-copy" data-brand="${closestMatch.brand}" data-product="${closestMatch.product}" data-shade="${closestMatch.shade}">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-full shadow-md" style="background-color: ${closestMatch.hex};"></div>
                    <div class="text-sm">
                        <p class="font-bold text-lg text-stone-800">${closestMatch.brand}</p>
                        <p class="text-sm text-gray-700">${closestMatch.product}</p>
                        <p class="text-sm text-gray-500">เฉดสี: ${closestMatch.shade}</p>
                    </div>
                </div>
            </div>
        `;

        if (otherMatches.length > 0) {
            matchHtml += `
                <h3 class="text-lg font-medium mb-3 text-stone-700 text-left">ผลิตภัณฑ์ที่ใกล้เคียงอื่นๆ</h3>
                <div class="overflow-x-auto w-full">
                    <!-- Table Header -->
                    <div class="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 py-3 bg-stone-100 rounded-t-xl font-bold text-stone-800 text-sm md:text-sm text-center border-b border-gray-300">
                        <span>สี</span>
                        <span>แบรนด์</span>
                        <span>ชื่อผลิตภัณฑ์</span>
                        <span>เฉดสี</span>
                    </div>
                    <div class="bg-white p-4 rounded-b-xl shadow-inner">
            `;

            otherMatches.forEach(match => {
                matchHtml += `
                    <!-- Table Row -->
                    <div class="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 py-4 items-center text-xs md:text-sm text-center hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200 card-with-copy" data-brand="${match.brand}" data-product="${match.product}" data-shade="${match.shade}">
                        <div class="flex items-center justify-center">
                            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md" style="background-color: ${match.hex};"></div>
                        </div>
                        <span class="font-bold text-stone-800">${match.brand}</span>
                        <span class="text-xs md:text-sm">${match.product}</span>
                        <span class="text-xs md:text-sm">${match.shade}</span>
                    </div>
                `;
            });

            matchHtml += `
                    </div>
                </div>
            `;
        }

        matchHtml += `
            <p class="mt-4 text-xs text-gray-500">หมายเหตุ: การเปรียบเทียบเฉดสีนี้เป็นเพียงแนวทางเบื้องต้นในการตัดสินใจ</p>
        `;
        matchingFoundationsDiv.innerHTML = matchHtml;

        // Add click event listeners to the new cards
        document.querySelectorAll('.card-with-copy').forEach(card => {
            card.addEventListener('click', (event) => {
                const brand = event.currentTarget.dataset.brand;
                const product = event.currentTarget.dataset.product;
                const shade = event.currentTarget.dataset.shade;
                const text = `${brand} ${product} ${shade}`;
                showConfirmationModal(text);
            });
        });

    } else {
        matchingFoundationsDiv.innerHTML = `
            <p class="text-xs text-gray-500 text-center">ไม่พบรองพื้นที่ใกล้เคียงในฐานข้อมูลตัวอย่าง</p>
        `;
    }
}

// --- Find alternative products from other brands ---
function findAlternativeProducts(selectedProductKey, selectedHex) {
    const selectedProductData = sampleFoundations.find(f => `${f.brand} ${f.product} ${f.shade}` === `${selectedProductKey} ${shadeDropdown.options[shadeDropdown.selectedIndex].text}`);
    if (!selectedProductData) return;

    const selectedBrand = selectedProductData.brand;
    const r = parseInt(selectedHex.slice(1, 3), 16);
    const g = parseInt(selectedHex.slice(3, 5), 16);
    const b = parseInt(selectedHex.slice(5, 7), 16);
    
    const selectedXYZ = sRGBtoXYZ(r, g, b);
    const selectedLab = XYZtoLab(selectedXYZ.X, selectedXYZ.Y, selectedXYZ.Z);

    // Filter out the selected brand
    const filteredFoundations = sampleFoundations.filter(f => f.brand !== selectedBrand);
    
    const matchesWithDistance = filteredFoundations.map(foundation => {
        const hex = foundation.hex;
        const fr = parseInt(hex.slice(1, 3), 16);
        const fg = parseInt(hex.slice(3, 5), 16);
        const fb = parseInt(hex.slice(5, 7), 16);

        const foundationXYZ = sRGBtoXYZ(fr, fg, fb);
        const foundationLab = XYZtoLab(foundationXYZ.X, foundationXYZ.Y, foundationXYZ.Z);
        const distance = deltaE00(selectedLab, foundationLab);
        return { ...foundation, distance };
    });

    matchesWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Display top 5 alternative products
    const top5Matches = matchesWithDistance.slice(0, 5);
    
    let html = '';
    if (top5Matches.length > 0) {
        html += `
            <div class="overflow-x-auto w-full">
                <div class="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 py-3 bg-stone-100 rounded-t-xl font-bold text-stone-800 text-sm md:text-sm text-center border-b border-gray-300">
                    <span>สี</span>
                    <span>แบรนด์</span>
                    <span>ชื่อผลิตภัณฑ์</span>
                    <span>เฉดสี</span>
                </div>
                <div class="bg-white p-4 rounded-b-xl shadow-inner">
        `;
        top5Matches.forEach(match => {
            html += `
                <div class="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 py-4 items-center text-xs md:text-sm text-center hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200 card-with-copy" data-brand="${match.brand}" data-product="${match.product}" data-shade="${match.shade}">
                    <div class="flex items-center justify-center">
                        <div class="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md" style="background-color: ${match.hex};"></div>
                    </div>
                    <span class="font-bold text-stone-800">${match.brand}</span>
                    <span class="text-xs md:text-sm">${match.product}</span>
                    <span class="text-xs md:text-sm">${match.shade}</span>
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;
    } else {
        html = `<p class="text-xs text-gray-500 text-center">ไม่พบรองพื้นที่ใกล้เคียงจากแบรนด์อื่นในฐานข้อมูลตัวอย่าง</p>`;
    }
    
    alternativeFoundationsList.innerHTML = html;
    
    // Add click event listeners to the new cards
    document.querySelectorAll('#alternative-foundations-list .card-with-copy').forEach(card => {
        card.addEventListener('click', (event) => {
            const brand = event.currentTarget.dataset.brand;
            const product = event.currentTarget.dataset.product;
            const shade = event.currentTarget.dataset.shade;
            const text = `${brand} ${product} ${shade}`;
            showConfirmationModal(text);
        });
    });
}