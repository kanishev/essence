// ---register/login modals

const modalWindow = document.querySelector('.mainLogin')
const modal = document.querySelector('.loginModal')

function modalOpen() {
    modal.classList.add('active')
    modalWindow.classList.add('active')
}

function modalClose(){
    modalWindow.classList.remove('active')
    modal.classList.remove('active')
}


// ---cart

const $cart = document.querySelector('table')

if($cart) {
    $cart.addEventListener('click', function(event) {
        const $target = event.target
        const id = $target.dataset.id

        if($target.classList.contains('addGood')){
            const csrf = $target.dataset.csrf

            fetch('/cart/add/' + id, {
                method: 'put',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(data => data.json())
            .then(data => {         
                if(data.goods.length){
                    let html = data.goods.map(c => {
                        return `                      
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.price}</td>
                            <td>${c.count}</td>
                            <td><button type="submit" class="btn btn-success addGood" data-id="${c._id}" data-csrf="${csrf}">+</button></td>
                            <td><button type="submit" class="btn btn-danger removeGood" data-id="${c._id}"  data-csrf="${csrf}">-</button></td>                    
                        </tr>
                        `
                    }).join('')
                    $cart.querySelector('tbody').innerHTML = html
                    document.querySelector('.price').innerHTML = data.price
                    document.querySelector('.card_total').innerHTML = data.price
                }

            })
        }else if ($target.classList.contains('removeGood')){
            const csrf = $target.dataset.csrf

            fetch('/cart/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(data => data.json())
        
            .then(data => {

                if(data.goods.length){
                    let html = data.goods.map(c => {
                        return `                      
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.price}</td>
                            <td>${c.count}</td>
                            <td><button type="submit" class="btn btn-success addGood" data-id="${c._id}" data-csrf="${csrf}">+</button></td>
                            <td><button type="submit" class="btn btn-danger removeGood" data-id="${c._id}" data-csrf="${csrf}">-</button></td>                    
                        </tr>
                        `
                    }).join('')
                    $cart.querySelector('tbody').innerHTML = html
                    document.querySelector('.price').innerHTML = data.price
                    document.querySelector('.card_total').innerHTML =  data.price

                }else {
                    document.querySelector('.tableblock').innerHTML = '<h1>There are nothing to byu</h1>'
                    document.querySelector('.card_total').innerHTML =  0
                }

            })
        }
    })
}

// ---favourite 

const favoures = document.querySelectorAll('.favme')

favoures.forEach(f => {
    f.addEventListener('click', (event) => {

        const target = event.target
        const id = target.dataset.id
        const csrf = target.dataset.csrf
        const favourBlock = document.querySelector('.favourBlock')

        if(target.classList.contains('active')){
           
            if(target.dataset.page == 'shop'){

                target.classList.remove('active')
                fetch('/favourite/remove/' + id, {
                    method: 'get'
                })
                .then(data => data.json())

            }else if (target.dataset.page == 'favourites'){
                
                fetch('/favourite/remove/' + id, {
                    method: 'get'
                })
                .then(data => data.json())
                .then(data => {
                    if(data.length){
                        console.log(data)
                        const html = data.map(g => `
                        <div class="col-12 col-sm-6 col-lg-4">
                        <div class="single-product-wrapper">
                            <!-- Product Image -->
                            <div class="product-img">
                                <img src="${g.img}" alt="">
                                <!-- Hover Thumb -->
                                <img class="hover-img" src="${g.hoverImg}" alt="">
        
                                <!-- Product Badge -->
                                <div class="product-badge new-badge">
                                    <span>New</span>
                                </div>
        
                                <!-- Favourite -->
                                <div class="product-favourite">
                                      <a data-id="${g._id}" data-csrf="${csrf}" class="favme fa fa-heart active"></a>
                                </div>
                            </div>
        
                            <!-- Product Description -->
                            <div class="product-description">
                                <span>topshop</span>
                                <a href="single-product-details.html">
                                    <h6>${g.title}</h6>
                                </a>
                                <p class="product-price">${g.price}</p>
        
                                <!-- Hover Content -->
                                <div class="hover-content">
                                    <!-- Add to Cart -->
                                    <form action="/cart/add" method="POST"> 
                                    <div class="add-to-cart-btn">
                                        <input type="hidden" name="_csrf" value="${csrf}">
                                        <input type="hidden" name="name" value="${g.title}">
                                        <input type="hidden" name="price" value="${g.price}">
                                        <input type="hidden" name="id" value="${g._id}">
                                        <button type="submit" class="btn essence-btn">Add to Cart</button>
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>`).join('')
                        favourBlock.innerHTML = html
                    }else{
                        favourBlock.innerHTML = "There are nothing to Love"
                    }
                })
            }

        } else {
            fetch('/favourite/add/' + id, {
                method: 'get',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
            .then(data => data.json())
            .then(data => target.classList.add(data))
        }
 
    })
})