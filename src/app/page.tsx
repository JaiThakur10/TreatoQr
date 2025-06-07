"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { MdLocalPhone } from "react-icons/md";

type Product = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  details: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Fruit Bowls",
    slug: "fruit-bowls",
    image: "/images/fruit-bowl.jpg",
    description: "Fresh seasonal fruits served chilled.",
    details: "Packed with vitamins and minerals. Served with honey and mint.",
    price: 129.99,
  },
  {
    id: 2,
    name: "Sprouts",
    slug: "sprouts",
    image: "/images/sprouts.webp",
    description: "Protein-packed healthy sprouts mix.",
    details: "Made with moong, chana, and seasonal herbs.",
    price: 89.5,
  },
  {
    id: 3,
    name: "Salads",
    slug: "salads",
    image: "/images/salad.jpg",
    description: "Crisp veggies with homemade dressings.",
    details: "Includes lettuce, carrots, cucumbers, and olive oil vinaigrette.",
    price: 109.75,
  },
  {
    id: 4,
    name: "Thali",
    slug: "thali",
    image: "/images/thali.jpeg",
    description: "A wholesome Indian meal combo.",
    details: "Includes dal, sabzi, roti, rice, salad, and dessert.",
    price: 179.0,
  },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const [addingItemId, setAddingItemId] = useState<number | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Get client location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        },
        {
          enableHighAccuracy: true, // Ask for GPS if available
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const getLocationLink = () => {
    if (!location) return "Location not shared";
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  };

  const handleCheckout = () => {
    if (!location) {
      alert("Fetching your location. Please wait a moment and try again.");
      return;
    }

    const orderSummary = cart
      .map(
        ({ product, quantity }) =>
          `• ${product.name} x${quantity} - ₹${(
            product.price * quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const locationText = getLocationLink();
    const message = `Hi! I'd like to order:\n\n${orderSummary}\n\nTotal: ₹${total.toFixed(
      2
    )}\n\nDelivery Location: ${locationText}`;

    const url = `https://wa.me/919419192452?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    setTimeout(() => {
      window.location.href = "/delivery";
    }, 500);
  };

  // Add item or increase quantity
  const addToCart = (product: Product) => {
    setAddingItemId(product.id); // show adding indicator
    setTimeout(() => {
      setCart((prev) => {
        const existingItem = prev.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { product, quantity: 1 }];
        }
      });

      setIsCartOpen(true);
      setAddingItemId(null); // remove adding indicator
    }, 300); // small delay for user feedback
  };

  // Decrease quantity or remove item
  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === productId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        if (updated[existingIndex].quantity > 1) {
          updated[existingIndex].quantity -= 1;
        } else {
          updated.splice(existingIndex, 1);
        }
        return updated;
      }
      return prev;
    });
  };

  // Calculate total price
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Close cart on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold text-white tracking-tight select-none">
          Treato
        </h1>
        <div className="flex items-center space-x-5">
          {/* Call Button */}
          <a
            href="tel:+917051368588"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 transition-colors text-red-700 font-semibold px-4 py-2 rounded-full shadow-md shadow-yellow-300"
            aria-label="Call Treato"
          >
            <MdLocalPhone className="w-5 h-5" />
            Call
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen((prev) => !prev)}
            className="relative text-white hover:text-yellow-300 focus:outline-none"
            aria-label="Toggle cart"
          >
            <GiShoppingBag className="w-7 h-7" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Panel */}
      <div
        ref={cartRef}
        className={`fixed right-0 top-0 w-80 h-full bg-white shadow-2xl p-5 border-l z-50 overflow-y-auto flex flex-col justify-between transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-red-600 select-none flex items-center gap-2">
              🛒 Your Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-red-500 text-3xl font-extrabold hover:text-red-700 transition-colors"
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>

          {/* Empty Cart */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center mt-16 select-none">
              <Image
                src="/images/emptybag.jpg"
                alt="Empty Cart"
                width={150}
                height={150}
                className="mb-6"
              />
              <p className="text-gray-500 text-center italic text-lg">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center text-sm border-b border-gray-200 pb-2"
                >
                  {/* Product Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-3 shadow-sm">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <span className="font-medium text-gray-800 select-text">
                      {product.name}
                    </span>
                    <p className="text-xs text-gray-500 select-text">
                      {product.details}
                    </p>
                    <p className="text-xs text-gray-700 select-text mt-1">
                      Quantity: {quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-red-600 font-semibold">
                      ₹{(product.price * quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700 font-bold transition-colors"
                      aria-label={`Remove one ${product.name} from cart`}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Footer */}
        <div>
          {cart.length > 0 && (
            <>
              <div className="mt-6 font-semibold text-lg text-right text-gray-900 select-text">
                Total: ₹{total.toFixed(2)}
              </div>
              <Link
                href={`https://wa.me/919419192452?text=${encodeURIComponent(
                  `Hi! I'd like to order:\n` +
                    cart
                      .map(
                        ({ product, quantity }) =>
                          `• ${product.name} x${quantity} - ₹${(
                            product.price * quantity
                          ).toFixed(2)}`
                      )
                      .join("\n") +
                    `\nTotal: ₹${total.toFixed(2)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 hover:from-red-700 hover:via-yellow-500 hover:to-red-700 transition-colors text-white py-3 rounded-xl font-semibold shadow-md select-none"
                >
                  Checkout on WhatsApp
                </button>
              </Link>
            </>
          )}

          {/* Footer Text */}
          {/* <p className="mt-8 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 select-none">
            Treato Refreshments & Food
          </p> */}
        </div>
      </div>

      <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-red-600  px-6 py-4  max-w-xl mx-auto mt-6">
        Whats in your mind today?
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={400}
              height={280}
              className="w-full h-48 object-cover rounded-t-3xl"
              priority
            />
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-bold text-red-600 mb-2 select-text">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-700 mb-1 select-text">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 select-text">
                  {item.details}
                </p>
              </div>
              <div className="flex justify-between items-center mt-5">
                <span className="text-lg font-extrabold text-gray-900 select-text">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-colors select-none"
                  aria-label={`Add ${item.name} to cart`}
                  disabled={addingItemId === item.id}
                >
                  {addingItemId === item.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer Text (page bottom) */}
      <div className="mt-10 p-4 ">
        <div className="w-full flex justify-center">
          <p className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 select-none">
            Treato Refreshments & Food
          </p>
        </div>
      </div>
      <div className=" text-center">
        <a
          href="https://www.weularity.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm cursor-pointer hover:text-gray-600"
        >
          <p>
            Crafted with ❤️ by Weularity. All rights reserved. &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </a>
      </div>
    </main>
  );
}
