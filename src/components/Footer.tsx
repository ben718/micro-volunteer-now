
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Voisin Solidaire. Tous droits réservés.
      </div>
    </footer>
  );
}
