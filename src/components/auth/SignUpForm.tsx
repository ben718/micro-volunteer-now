import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('benevole'); // Default role

  // Association specific states
  const [associationName, setAssociationName] = useState('');
  const [siret, setSiret] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');


  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    let metadata: any = { role };

    if (role === 'benevole') {
      metadata = {
        ...metadata,
        first_name: firstName,
        last_name: lastName,
        // Add other benevole specific fields if needed later
      };
      // Basic validation for benevole
      if (!firstName || !lastName) {
         setError('Veuillez remplir votre prénom et votre nom.');
         setLoading(false);
         return;
      }
    } else if (role === 'association') {
      metadata = {
        ...metadata,
        associationName,
        siret, // Optional but unique in DB
        address,
        city,
        postalCode,
        phone,
        category,
        contactName,
        contactRole,
        contactEmail,
      };
      // Basic validation for association (check required fields from bdd.sql)
      if (!associationName || !address || !city || !postalCode || !phone || !category || !contactName || !contactRole || !contactEmail) {
          setError('Veuillez remplir tous les champs obligatoires pour l\'association.');
          setLoading(false);
          return;
      }
    }

    try {
      const { error: authError } = await signUp(email, password, metadata);

      if (authError) {
        setError(authError.message);
      } else {
        // Redirect after successful signup
        // Depending on your flow, you might want to redirect associations to a different page
        navigate('/auth/verify-email');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Je suis :</label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="role-benevole"
                name="role"
                type="radio"
                value="benevole"
                checked={role === 'benevole'}
                onChange={(e) => setRole(e.target.value)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="role-benevole" className="ml-2 block text-sm text-gray-900">
                Un bénévole
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="role-association"
                name="role"
                type="radio"
                value="association"
                checked={role === 'association'}
                onChange={(e) => setRole(e.target.value)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="role-association" className="ml-2 block text-sm text-gray-900">
                Une association
              </label>
            </div>
          </div>
        </div>

        {/* Common Fields (Email, Password always visible) */}
         <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (utilisateur pour la connexion)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>


        {/* Benevole Specific Fields */}
        {role === 'benevole' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Association Specific Fields */}
        {role === 'association' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="associationName" className="block text-sm font-medium text-gray-700">
                Nom de l'association
              </label>
              <input
                id="associationName"
                type="text"
                value={associationName}
                onChange={(e) => setAssociationName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             <div>
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                Numéro SIRET (optionnel)
              </label>
              <input
                id="siret"
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             <div>
               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie principale
              </label>
              {/* You might want a select dropdown for categories based on your DB */}
               <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             {/* Contact Information */}
             <h3 className="text-lg font-semibold mt-6 mb-2">Contact principal</h3>
             <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                Nom du contact
              </label>
              <input
                id="contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             <div>
              <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700">
                Rôle du contact
              </label>
              <input
                id="contactRole"
                type="text"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Email du contact
              </label>
              {/* Note: The DB function concatenates this with the main user email.
                   Confirm if this is the desired behavior or if you should just send the full email here. */}
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}



        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
}