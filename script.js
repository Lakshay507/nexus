const products = [
 {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:2499,old:3499,rating:4.8,emoji:"🎧",tag:"BESTSELLER",desc:"Immersive sound, soft ear cushions and long-lasting battery life for your everyday listening."},
 {id:2,name:"Smart Watch Series X",category:"Electronics",price:3299,old:4299,rating:4.6,emoji:"⌚",tag:"HOT DEAL",desc:"Track your activity, check notifications and keep your day on schedule."},
 {id:3,name:"Classic Everyday Sneakers",category:"Fashion",price:1899,old:2499,rating:4.5,emoji:"👟",tag:"TRENDING",desc:"Comfortable everyday sneakers with a clean, versatile look."},
 {id:4,name:"Minimal Travel Backpack",category:"Fashion",price:1299,old:1799,rating:4.7,emoji:"🎒",tag:"POPULAR",desc:"A practical backpack with room for your daily essentials."},
 {id:5,name:"Ceramic Coffee Set",category:"Home",price:899,old:1199,rating:4.4,emoji:"☕",tag:"NEW",desc:"A simple ceramic set to make your coffee moments feel special."},
 {id:6,name:"Ambient Table Lamp",category:"Home",price:1599,old:2199,rating:4.6,emoji:"💡",tag:"GREAT VALUE",desc:"Warm ambient lighting for your desk, bedside or reading corner."},
 {id:7,name:"The Creative Mindset",category:"Books",price:499,old:699,rating:4.9,emoji:"📚",tag:"TOP RATED",desc:"A thoughtful read about creativity, curiosity and building better habits."},
 {id:8,name:"Daily Planner Notebook",category:"Books",price:299,old:399,rating:4.5,emoji:"📓",tag:"PICK FOR YOU",desc:"Plan your goals, organise your tasks and capture new ideas."}
];
let cart = JSON.parse(localStorage.getItem("miniAmazonCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("miniAmazonWishlist") || "[]");
let activeFilter = "all";
const grid = document.getElementById("productGrid");
const money = n => "₹" + n.toLocaleString("en-IN");
function save(){localStorage.setItem("miniAmazonCart",JSON.stringify(cart));localStorage.setItem("miniAmazonWishlist",JSON.stringify(wishlist));}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2100);}
function renderProducts(){
 const term=document.getElementById("searchInput").value.trim().toLowerCase();
 const category=document.getElementById("categorySelect").value;
 const shown=products.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(category==="all"||p.category===category)&&(!term||p.name.toLowerCase().includes(term)||p.category.toLowerCase().includes(term)));
 grid.innerHTML=shown.length?shown.map(p=>`<article class="product"><div class="product-image" data-view="${p.id}"><span>${p.emoji}</span><span class="tag">${p.tag}</span><button class="heart ${wishlist.includes(p.id)?"liked":""}" data-heart="${p.id}" aria-label="Add to wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button></div><div class="product-info"><div class="category">${p.category}</div><h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating} / 5</span></div><div class="price">${money(p.price)} <span class="old-price">${money(p.old)}</span></div><button class="add-btn" data-add="${p.id}">Add to cart +</button></div></article>`).join(""):'<p class="empty">No products found. Try another search.</p>';
}
function renderCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0),total=cart.reduce((s,i)=>s+i.qty*products.find(p=>p.id===i.id).price,0);
 document.getElementById("cartCount").textContent=count;document.getElementById("cartSubtotal").textContent=`Subtotal (${count} items): ${money(total)}`;
 const box=document.getElementById("cartItems");
 box.innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-emoji">${p.emoji}</div><div class="cart-detail"><b>${p.name}</b><small>${money(p.price)} each</small></div><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><b>${i.qty}</b><button data-qty="${p.id}" data-delta="1">+</button></div><b>${money(p.price*i.qty)}</b><button class="remove" data-remove="${p.id}">Remove</button></div>`}).join(""):'<p class="empty">Your cart is waiting for something good.</p>';
}
function add(id){const item=cart.find(i=>i.id===id);item?item.qty++:cart.push({id,qty:1});save();renderCart();toast("Added to your cart!");}
function showProduct(id){const p=products.find(x=>x.id===id);document.getElementById("modalContent").innerHTML=`<div class="modal-product"><div class="big-emoji">${p.emoji}</div><div><div class="category">${p.category}</div><h2>${p.name}</h2><div class="rating">★★★★★ <span>${p.rating} / 5</span></div><h3>${money(p.price)}</h3><p>${p.desc}</p><button class="add-btn" data-add="${p.id}">Add to cart +</button></div></div>`;document.getElementById("modal").classList.add("open");}
grid.addEventListener("click",e=>{const addBtn=e.target.closest("[data-add]"),heart=e.target.closest("[data-heart]"),view=e.target.closest("[data-view]");if(addBtn)add(Number(addBtn.dataset.add));else if(heart){const id=Number(heart.dataset.heart);wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts();toast(wishlist.includes(id)?"Saved to wishlist":"Removed from wishlist");}else if(view)showProduct(Number(view.dataset.view));});
document.getElementById("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const id=Number(q.dataset.qty),item=cart.find(i=>i.id===id);item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==id);}if(r)cart=cart.filter(i=>i.id!==Number(r.dataset.remove));save();renderCart();});
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();activeFilter="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderProducts();document.getElementById("products").scrollIntoView();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("categorySelect").addEventListener("change",renderProducts);
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
document.getElementById("allProducts").addEventListener("click",()=>{activeFilter="all";document.getElementById("categorySelect").value="all";document.getElementById("searchInput").value="";renderProducts();});
document.getElementById("cartJump").addEventListener("click",()=>document.getElementById("cart").scrollIntoView());
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("modal").classList.remove("open"));
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open");});
document.getElementById("modalContent").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b){add(Number(b.dataset.add));document.getElementById("modal").classList.remove("open");}});
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){toast("Your cart is empty!");return;}document.getElementById("modalContent").innerHTML=`<div style="text-align:center;padding:20px"><div style="font-size:55px">🎉</div><h2>Order placed successfully!</h2><p style="color:#697586;font-size:13px">This is a demo checkout. Thanks for shopping with Mini Amazon.</p><button class="add-btn" id="continueShopping">Continue shopping</button></div>`;document.getElementById("modal").classList.add("open");cart=[];save();renderCart();document.getElementById("continueShopping").addEventListener("click",()=>document.getElementById("modal").classList.remove("open"));});
document.getElementById("accountBtn").addEventListener("click",()=>toast("Welcome to Mini Amazon!"));
document.getElementById("ordersBtn").addEventListener("click",()=>toast("Your demo order history will appear here."));
renderProducts();renderCart();
