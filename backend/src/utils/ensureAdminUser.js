import User from '../models/User.js';

const DEFAULT_ADMIN_NAME = 'Platform Admin';
const DEFAULT_ADMIN_EMAIL = 'admin@elibary.app';
const DEFAULT_ADMIN_PASSWORD = 'AdminAccess123!';

export async function ensureAdminUser() {
  const name = process.env.ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;

  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long.');
  }

  const existingAdmin = await User.findOne({ email }).select('+password');

  if (!existingAdmin) {
    await User.create({
      name,
      email,
      password,
      role: 'admin',
    });
    console.log(`Created admin account for ${email}.`);
    return;
  }

  let hasChanges = false;

  if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    hasChanges = true;
  }

  if (existingAdmin.name !== name) {
    existingAdmin.name = name;
    hasChanges = true;
  }

  if (hasChanges) {
    await existingAdmin.save();
    console.log(`Verified admin account for ${email}.`);
  }
}
