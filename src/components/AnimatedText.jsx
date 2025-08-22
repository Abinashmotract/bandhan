// import React, { useEffect, useState } from 'react';
// import { Box, Typography, keyframes } from '@mui/material';
// import { styled } from '@mui/system';

// // Keyframe animations
// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(30px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

// const gradient = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `;

// const typing = keyframes`
//   from { width: 0; }
//   to { width: 100%; }
// `;

// const blinkCaret = keyframes`
//   from, to { border-color: transparent; }
//   50% { border-color: #d81b60; }
// `;

// // Styled components
// const AnimatedTypography = styled(Typography)(({ theme }) => ({
//   color: '#d81b60',
//   fontWeight: 700,
//   animation: `${fadeIn} 1.5s ease-out forwards`,
//   opacity: 0,
//   textAlign: 'center',
//   position: 'relative',
//   padding: '0 10px',
//   marginBottom: '30px',
  
//   // For gradient text animation
//   '&.gradient': {
//     background: 'linear-gradient(135deg, #d81b60, #880e4f, #7b1fa2, #d81b60)',
//     backgroundSize: '300% 300%',
//     backgroundClip: 'text',
//     WebkitBackgroundClip: 'text',
//     color: 'transparent',
//     animation: `${fadeIn} 1.5s ease-out forwards, ${gradient} 8s ease infinite, ${pulse} 3s ease infinite`,
//   },
  
//   // For typing animation
//   '&.typing': {
//     overflow: 'hidden',
//     borderRight: '3px solid #d81b60',
//     whiteSpace: 'nowrap',
//     animation: `${typing} 3.5s steps(40, end), ${blinkCaret} .75s step-end infinite`,
//   },
  
//   // For word-by-word animation
//   '&.word-by-word': {
//     '& span': {
//       opacity: 0,
//       display: 'inline-block',
//       animation: `${fadeIn} 0.5s ease forwards`,
//     },
//   },
// }));

// const StyledBox = styled(Box)({
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   minHeight: '200px',
//   padding: '20px',
// });

// const AnimationSelector = styled(Box)({
//   display: 'flex',
//   justifyContent: 'center',
//   gap: '10px',
//   marginBottom: '20px',
//   flexWrap: 'wrap',
// });

// const SelectorButton = styled('button')(({ active }) => ({
//   padding: '8px 16px',
//   border: 'none',
//   borderRadius: '20px',
//   backgroundColor: active ? '#d81b60' : '#f8bbd0',
//   color: active ? 'white' : '#880e4f',
//   cursor: 'pointer',
//   fontWeight: '500',
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     backgroundColor: '#d81b60',
//     color: 'white',
//   },
// }));

// const TextWithShadow = styled('span')({
//   textShadow: '3px 3px 6px rgba(136, 14, 79, 0.4)',
// });

// const TextWithDecoration = styled('span')({
//   position: 'relative',
//   '&::after': {
//     content: '""',
//     position: 'absolute',
//     bottom: '-5px',
//     left: '0',
//     width: '100%',
//     height: '4px',
//     background: 'linear-gradient(90deg, #d81b60, #880e4f)',
//     borderRadius: '2px',
//   },
// });

// const AnimatedText = () => {
//   const [animationType, setAnimationType] = useState('gradient');
//   const [wordIndex, setWordIndex] = useState(0);
//   const words = ["Find", "Your", "Perfect", "Life", "Partner"];

//   useEffect(() => {
//     if (animationType === 'word-by-word') {
//       const timers = words.map((_, i) => 
//         setTimeout(() => setWordIndex(i), i * 600)
//       );
      
//       return () => timers.forEach(timer => clearTimeout(timer));
//     }
//   }, [animationType]);

//   const renderText = () => {
//     switch(animationType) {
//       case 'gradient':
//         return (
//           <AnimatedTypography variant="h2" component="h1" className="gradient">
//             Find Your Perfect Life Partner
//           </AnimatedTypography>
//         );
      
//       case 'typing':
//         return (
//           <AnimatedTypography variant="h2" component="h1" className="typing">
//             Find Your Perfect Life Partner
//           </AnimatedTypography>
//         );
      
//       case 'word-by-word':
//         return (
//           <AnimatedTypography variant="h2" component="h1" className="word-by-word">
//             {words.map((word, i) => (
//               <span 
//                 key={i} 
//                 style={{ 
//                   animationDelay: `${i * 0.6}s`,
//                   opacity: i <= wordIndex ? 1 : 0
//                 }}
//               >
//                 {word}{i < words.length - 1 ? ' ' : ''}
//               </span>
//             ))}
//           </AnimatedTypography>
//         );
      
//       case 'shadow':
//         return (
//           <AnimatedTypography variant="h2" component="h1">
//             <TextWithShadow>Find Your Perfect Life Partner</TextWithShadow>
//           </AnimatedTypography>
//         );
      
//       case 'decoration':
//         return (
//           <AnimatedTypography variant="h2" component="h1">
//             <TextWithDecoration>Find Your Perfect Life Partner</TextWithDecoration>
//           </AnimatedTypography>
//         );
      
//       default:
//         return (
//           <AnimatedTypography variant="h2" component="h1">
//             Find Your Perfect Life Partner
//           </AnimatedTypography>
//         );
//     }
//   };

//   return (
//     <Box sx={{ py: 8, background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)' }}>
//         <AnimationSelector>
//           {['gradient', 'typing', 'word-by-word', 'shadow', 'decoration'].map((type) => (
//             <SelectorButton
//               key={type}
//               active={animationType === type}
//               onClick={() => setAnimationType(type)}
//             >
//               {type.replace('-', ' ')}
//             </SelectorButton>
//           ))}
//         </AnimationSelector>
        
//         <StyledBox>
//           {renderText()}
//         </StyledBox>
        
//         <Typography variant="body1" align="center" sx={{ color: '#78909c', mt: 4 }}>
//           Select different animation styles from above to see various effects
//         </Typography>
//     </Box>
//   );
// };

// export default AnimatedText;