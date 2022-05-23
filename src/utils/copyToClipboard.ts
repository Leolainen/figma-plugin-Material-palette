// Don't think this works – REMOVE?
// export const copyToClipboard = (text) => {
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(text).then(
//       () => {
//         console.log("Async: Copying to clipboard was successful!");
//       },
//       (err) => {
//         console.error("Async: Could not copy text: ", err);
//       }
//     );
//   } else {
//     const textArea = document.createElement("textarea");
//     textArea.value = text;

//     // Avoid scrolling to bottom
//     textArea.style.top = "0";
//     textArea.style.left = "0";
//     textArea.style.position = "fixed";

//     document.body.appendChild(textArea);
//     textArea.focus();
//     textArea.select();

//     try {
//       const successful = document.execCommand("copy");
//       const msg = successful
//         ? `copied ${text} to clipboard`
//         : "failed to copy to clipboard :(";
//       console.log(msg);
//     } catch (err) {
//       console.error("Oops, unable to copy", err);
//     }

//     document.body.removeChild(textArea);
//   }
// };

// export default copyToClipboard;
