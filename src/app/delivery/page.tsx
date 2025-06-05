// app/delivery/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center px-4">
      <Image
        src="/images/boy.png"
        alt="Delivery Scooter Rider"
        width={300}
        height={300}
        className="mb-6"
        priority
      />
      <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
        Hang tight! 🚀 Your food is on the way!
      </h1>
      <p className="text-gray-700 max-w-xl mb-8 text-lg">
        Our delivery partner is zipping through traffic and will be at your
        doorstep shortly. Meanwhile, why not wash your hands and get your
        appetite ready? 🍽️🧼
      </p>
      <Link href="/">
        <button className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 hover:from-red-700 hover:via-yellow-500 hover:to-red-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition-all">
          Add More Food
        </button>
      </Link>
    </main>
  );
}
