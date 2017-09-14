export default function(fn) {
  if (document.readyState != 'loading' && document.body != null){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
