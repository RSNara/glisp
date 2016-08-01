export default function tokenize(program) {
  return program
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/#{/g, ' #{ ')
    .replace(/([^#]|^){/g, '$1 { ')
    .replace(/}/g, ' } ')
    .split(/[,\s]/)
    .filter(Boolean);
}
