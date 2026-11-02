//-----------------------------
//CRYSTAL PARK GAS SOLUTION- FINAL MAIN JS

// 1. MOBILE MENU(hamburger)
const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navlinks.classList.toggle('open');
  hamburger.classList.toggle('toggle');
  hamburger.textContent = hamburger.textContent === '☰' ? '✖' : '☰';
});

//Close menu when link clicked 
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navlinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

// 2. CONTACT/ORDER FORM with validation 
const form = document.getElementById('contactForm');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // PreventDefault form submission
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
const phone = document.getElementById('phone').value.trim();
const gas=document.getElementById('gas').value.trim();

if (!name || !email || !message || !phone || !gas) {
    alert('Please fill in all fields.');
    return;
  }
  // Success 
  alert ('Thank you for your message! We will get back to you soon.');
  form.reset(); // Reset the form after submission
});
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
alert ('Thank you $ {name}! Your ${gas} order has been received. We will contact you at $ {email} or $ {phone} soon.');
  form.reset(); // Reset the form after submission

  // 3. PRICE CALCULATOR - shows price based on gas type and quantity when you select gas
  const gasSelect = document.getElementById('gas');
  const quantityInput = document.getElementById('quantity');
  const priceDisplay = document.getElementById('priceDisplay'); 
  if (gasSelect && quantityInput && priceDisplay) {
    gasSelect.addEventListener('change', updatePrice);
    quantityInput.addEventListener('input', updatePrice);
    const gasPrices = {
        '19kg -refill': R450,
        '19kg -new': R550, NEW CYCLINDER R950
        '9kg -refill': R250
        '9kg -new': R350, NEW CYCLINDER R650
        '5kg -refill': R180
        '5kg -new': R280, NEW CYLINDER R450
    };
    priceDisplay.textContent = 'Please select a gas type and enter quantity.';
    function updatePrice() {
      const selectedGas = gasSelect.value;  
      priceDisplay.style.color = 'black'; // Reset color to black
      if (selectedGas && quantityInput.value) {
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
          priceDisplay.textContent = 'Please enter a valid quantity.';
          priceDisplay.style.color = 'red'; // Change color to red for error
        } else {
          const pricePerUnit = gasPrices[selectedGas];
          const totalPrice = pricePerUnit * quantity;
          priceDisplay.textContent = `Total Price: R${totalPrice.toFixed(2)}`;
        }
      }
    }   

    //4. Changelog -CLICK TO EXPAND DETAILS 
    const changelogItems = document.querySelectorAll('.changelog-item');
    changelogItems.forEach(item => {
      const header = item.querySelector('.changelog-header');
      const details = item.querySelector('.changelog-details');
      header.addEventListener('click', () => {
        details.classList.toggle('open');
        header.classList.toggle('open');
      });
    });
    document.querySelectorAll('.changelog-header').forEach(header => {
      header.addEventListener('click', () => {
        const details = header.nextElementSibling;
        entry.style.cursor = 'pointer';
        if (details.style.display === 'block') {
          details.style.display = 'none';   
        } else {    
            entry.addEventListener('click', () => {
            details.style.display = 'block';
          });
        }
      }
    });
  }

  // 5. STICKY HEADER SHADOW ON SCROLL 
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');    
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (header ) return; // Exit if header is not found
  }
  console.log ('CRYSTAL PARK GAS SOLUTION - FINAL MAIN JS LOADED SUCCESSFULLY');   
  