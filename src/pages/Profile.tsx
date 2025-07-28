import { Fragment, useState } from 'react';

export default function Profile() {
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/120');
  const [form, setForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 555-0102',
    role: 'Project Manager',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert('Profile saved (mock)');
  };

  return (
    <Fragment>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500">Update your personal information</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img
            src={avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <label className="inline-block cursor-pointer text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="hidden"
            />
          </label>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-5 lg:col-span-2"
        >
          {[
            { label: 'Full name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone', type: 'tel' },
            { label: 'Role / Title', name: 'role', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Save changes
          </button>
        </form>
      </div>
    </Fragment>
  );
}
