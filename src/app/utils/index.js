export function signOut(callback = () => null) {
  localStorage.removeItem('TOKEN');
  localStorage.removeItem('USER');

  return callback();
}
