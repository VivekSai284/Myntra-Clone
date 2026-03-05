const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://vivek:vivek123@cluster0.dcqiekf.mongodb.net/?appName=Cluster0/test")

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
  discount: String,
  description: String,
  sizes: [String],
  stock: Number,
  isActive: Boolean,
  images: [String],
  popularityScore: { type: Number, default: 0 }
}))

// -------- 30 BRANDS PER CATEGORY --------

const menBrands = [
"Nike","Adidas","Puma","Roadster","Levis","H&M","Zara","HRX","UCB","Tommy Hilfiger",
"Calvin Klein","Wrangler","Jack & Jones","Van Heusen","Peter England",
"Louis Philippe","Allen Solly","US Polo","Superdry","Reebok",
"Under Armour","Fila","New Balance","Sparx","Campus",
"Bata","Red Tape","Woodland","Arrow","Blackberrys"
]

const womenBrands = [
"ONLY","Vero Moda","Biba","Libas","W","Global Desi",
"Zara","H&M","Forever21","Mango","AND",
"FabIndia","Aurelia","DressBerry","Tokyo Talkies","SASSAFRAS",
"Chemistry","Miss Chase","Trendyol","LULU & SKY",
"Pantaloons","Marks & Spencer","Allen Solly Woman",
"Van Heusen Woman","UCB Women","Levis Women",
"Roadster Women","Pepe Jeans","Kazo","Label Ritu Kumar"
]

const kidsBrands = [
"Gini & Jony","Mothercare","Hopscotch","LilPicks",
"Mini Klub","Allen Solly Kids","US Polo Kids",
"Levis Kids","Zara Kids","H&M Kids",
"Babyhug","Carter's","Puma Kids","Adidas Kids",
"Nike Kids","Peppermint","Cherry Crumble",
"Palm Tree","United Colors Kids","Little Kangaroos",
"ToffyHouse","Fox Kids","Flying Machine Kids",
"612 League","Young Birds","Bumzee","Little Bansi",
"Magic Needles","Bebe","Babyoye"
]

const beautyBrands = [
"Lakme","Maybelline","L'Oreal","MAC","Sugar","Nykaa",
"Revlon","Faces Canada","Plum","Mamaearth",
"Biotique","Lotus","Colorbar","Kay Beauty",
"Chambor","Clinique","Estee Lauder","Bobbi Brown",
"Minimalist","Dot & Key","Pilgrim","The Body Shop",
"Forest Essentials","Neutrogena","Cetaphil",
"Vaseline","Nivea","Dove","Olay","Garnier"
]

// -------- PRODUCT TYPES --------

const menProducts = [
"Running Shoes","Casual Shirt","Denim Jeans","Sports Jacket","Polo T-Shirt",
"Formal Shirt","Hoodie","Cargo Pants","Track Pants","Blazer",
"Sweatshirt","Leather Jacket","Sneakers","Flip Flops","Gym Shorts",
"Winter Coat","Kurta","Ethnic Jacket","Sweatpants","Training Shoes",
"Baseball Cap","Casual Shorts","Tank Top","Formal Trousers","Cardigan",
"Printed Shirt","Slim Fit Jeans","Denim Shirt","Wool Sweater","Sports T-Shirt"
]

const womenProducts = [
"Summer Dress","Floral Top","High Waist Jeans","Kurti","Denim Jacket",
"Party Gown","Crop Top","Maxi Dress","Ethnic Kurta","Palazzo Pants",
"Printed Saree","Anarkali Dress","Shrug","Leggings","Skirt",
"Blouse","Cardigan","Tunic","Jumpsuit","Sweatshirt",
"Hoodie","Night Suit","Winter Coat","Bodycon Dress","Churidar",
"Salwar Suit","Tank Top","Denim Shorts","Formal Shirt","Party Top"
]

const kidsProducts = [
"Kids T-Shirt","Kids Sneakers","Cartoon Hoodie","Kids Shorts",
"Kids Jacket","School Shoes","Kids Jeans","Kids Kurta",
"Kids Pajama Set","Kids Sweater","Kids Hoodie",
"Kids Party Dress","Kids Sandals","Kids Track Pants",
"Kids Blazer","Kids Skirt","Kids Top","Kids Sweatshirt",
"Kids Winter Coat","Kids Shirt","Kids Shorts Set",
"Kids Nightwear","Kids Sports Shoes","Kids Socks",
"Kids Cap","Kids Flip Flops","Kids Uniform Shirt",
"Kids Uniform Pants","Kids Denim Jacket","Kids Printed T-Shirt"
]

const beautyProducts = [
"Lipstick","Face Wash","Perfume","Moisturizer","Foundation",
"Sunscreen","Eyeliner","Mascara","Compact Powder","Face Serum",
"Night Cream","Day Cream","Hair Oil","Shampoo","Conditioner",
"Body Lotion","Face Scrub","Makeup Remover","Primer","BB Cream",
"Hair Serum","Hair Mask","Lip Balm","Face Mask","Highlighter",
"Blush","Nail Polish","Hair Spray","Body Mist","Under Eye Cream"
]

// -------- IMAGES --------

const images = [
"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
"https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500",
"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
]

// -------- UTIL FUNCTIONS --------

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

function randomPrice(){
  return Math.floor(Math.random()*4500)+500
}

// -------- GENERATE PRODUCTS --------

async function seedProducts(){

  const products = []

  function generate(category, brands, items, count){

    for(let i=0;i<count;i++){

      products.push({
        name: random(items),
        brand: random(brands),
        category,
        price: randomPrice(),
        discount: `${Math.floor(Math.random()*60)+10}% OFF`,
        description: "Premium quality product designed for comfort, durability and style.",
        sizes: ["XS","S","M","L","XL"],
        stock: 20,
        isActive: true,
        images: [random(images)],
        popularityScore: Math.floor(Math.random()*1000)
      })

    }

  }

  generate("Men", menBrands, menProducts, 125)
  generate("Women", womenBrands, womenProducts, 125)
  generate("Kids", kidsBrands, kidsProducts, 125)
  generate("Beauty", beautyBrands, beautyProducts, 125)

  await Product.insertMany(products)

  console.log("500 products inserted successfully")

  mongoose.disconnect()

}

seedProducts()