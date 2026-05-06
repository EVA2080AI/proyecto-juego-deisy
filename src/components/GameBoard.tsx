import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice5, CheckCircle, ChevronRight, Info, Zap, Lock, Star, StarHalf, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { soundManager } from '../utils/soundFx';

interface GameBoardProps {
  userData: any;
}

const steps = [
  { 
    id: 1, 
    title: '¡Bienvenidos!', 
    content: 'Comienza tu viaje para descubrir el mundo de la audición con Advanced Bionics.', 
    type: 'start',
    image: 'https://marvel-b1-cdn.bc0a.com/f00000000079647/www.advancedbionics.com/latam/es/home/explore/processors-and-cochlear-implants/hires-ultra-3d-and-mri-compatibility/_jcr_content/main-content/band_1550993049/twocolumncontainer/custom-container-column-1/commonimage.abimage.1280.0.jpg/1572013840748.jpg'
  },
  { 
    id: 2, 
    title: 'Anatomía 3D', 
    content: 'Arrastra y rota este modelo 3D interactivo para observar cómo el implante se integra con el oído interno.', 
    type: 'info', 
    details: 'El implante estimula directamente el nervio auditivo, saltándose las partes dañadas del oído interno (cóclea).',
    interactive3d: '4f5438fc9337454587ec4a2c30c8c42f'
  },
  { 
    id: 3, 
    title: '¿Cómo funciona?', 
    content: '¿Qué parte del sistema auditivo estimula directamente el implante coclear?', 
    type: 'activity',
    options: ['El tímpano', 'El nervio auditivo', 'Los huesecillos'],
    correct: 1
  },
  { 
    id: 4, 
    title: 'HiRes Ultra 3D', 
    content: 'Explora el implante interno diseñado para el futuro.', 
    type: 'info', 
    details: 'Cuenta con un imán 3D único que permite realizar resonancias magnéticas (MRI) sin dolor y sin necesidad de cirugía.',
    interactive3d: '711fa10abc654b21ae29e39815f28c73'
  },
  { 
    id: 5, 
    title: 'Procesador Naída', 
    content: 'Potencia y conectividad para adultos.', 
    type: 'info', 
    details: 'La tecnología Marvel permite conectarse directamente a tu celular por Bluetooth.',
    video: 'https://www.youtube.com/embed/z4B72b4vXU8?autoplay=0' /* Naida CI Marvel */
  },
  { 
    id: 6, 
    title: 'Micrófono T-Mic 2', 
    content: 'La audición más natural posible.', 
    type: 'info', 
    details: 'Es el único micrófono que se coloca en la entrada del canal auditivo, aprovechando la acústica natural de tu propia oreja.',
    video: 'https://www.youtube.com/embed/Y0T7o_Y1hBw?autoplay=0' /* T-Mic */
  },
  { 
    id: 7, 
    title: 'Reto: T-Mic', 
    content: '¿Dónde se ubica el exclusivo micrófono T-Mic de Advanced Bionics?', 
    type: 'activity',
    options: ['Detrás de la oreja', 'En la entrada del canal auditivo', 'En el imán'],
    correct: 1
  },
  { 
    id: 8, 
    title: 'AutoSense OS (IA)', 
    content: 'Tu procesador piensa y se adapta por ti usando Inteligencia Artificial.', 
    type: 'info', 
    details: 'Analiza el sonido del entorno y ajusta automáticamente la configuración para reducir el ruido y enfocar el habla.',
    video: 'https://www.youtube.com/embed/Q5W453Yg8E8?autoplay=0' /* AutoSense OS */
  },
  { 
    id: 9, 
    title: 'Comparador de Audio', 
    content: 'Escucha la diferencia que hace la Inteligencia Artificial (AutoSense OS) en un entorno ruidoso como un restaurante.', 
    type: 'audio-compare'
  },
  { 
    id: 10, 
    title: 'ClearVoice', 
    content: 'Entiende el habla incluso con ruido.', 
    type: 'info', 
    details: 'Analiza automáticamente el entorno para separar el habla del ruido de fondo, mejorando la comunicación en restaurantes o autos.',
    video: 'https://www.youtube.com/embed/b8X5-Q19YvY?autoplay=0' /* ClearVoice */
  },
  { 
    id: 11, 
    title: 'Vida Activa', 
    content: '¡Escucha incluso bajo el agua!', 
    type: 'info', 
    details: 'Con la batería sumergible M puedes nadar hasta 3 metros de profundidad por más de 18 horas.',
    video: 'https://www.youtube.com/embed/7VnL2N4A9rY?autoplay=0' /* Waterproof */
  },
  { 
    id: 12, 
    title: 'Reto: Resonancia', 
    content: '¿Es necesario quitar el imán del HiRes Ultra 3D para una resonancia magnética?', 
    type: 'activity',
    options: ['Sí, siempre', 'No, gracias a su imán 3D', 'Solo en algunos casos'],
    correct: 1
  },
  { 
    id: 13, 
    title: 'Tecnología Roger', 
    content: 'La voz directa a tus oídos.', 
    type: 'info', 
    details: 'Marvel CI funciona directamente con micrófonos Roger, transmitiendo la voz del orador inalámbricamente en entornos muy ruidosos.',
    video: 'https://www.youtube.com/embed/1k4N1o2uU8A?autoplay=0' /* Roger */
  },
  { 
    id: 14, 
    title: 'Rompecabezas Lógico', 
    content: 'Ordena correctamente los pasos de cómo viaja el sonido a través de un Implante Coclear.', 
    type: 'puzzle',
    puzzlePieces: [
      { id: 1, text: '1. El micrófono capta el sonido' },
      { id: 2, text: '2. El procesador convierte el sonido a digital' },
      { id: 3, text: '3. La antena transmite al implante interno' },
      { id: 4, text: '4. Los electrodos estimulan el nervio auditivo' }
    ]
  },
  { 
    id: 15, 
    title: 'AB Remote', 
    content: 'El control total en tu smartphone.', 
    type: 'info', 
    details: 'Programa de forma remota, ajusta el volumen y revisa tus estadísticas con la aplicación ListenFit.',
    video: 'https://www.youtube.com/embed/0X4gQ3-tO5o?autoplay=0' /* AB Remote */
  },
  { 
    id: 16, 
    title: 'Electrodos HiFocus', 
    content: 'Diseñados para proteger tu audición natural.', 
    type: 'info', 
    details: 'Nuestros delicados haces de electrodos se insertan suavemente en la cóclea para preservar las estructuras auditivas delicadas.',
    video: 'https://www.youtube.com/embed/v9C0c5U7gMw?autoplay=0' /* Electrodes */
  },
  { 
    id: 17, 
    title: 'Conectividad Universal', 
    content: 'Transmite desde cualquier dispositivo Bluetooth.', 
    type: 'info', 
    details: 'Escucha llamadas, música, o la televisión en ambos oídos directamente desde cualquier dispositivo con Bluetooth.',
    video: 'https://www.youtube.com/embed/D3v9uK_rXhI?autoplay=0' /* Bluetooth */
  },
  { 
    id: 18, 
    title: 'Reto: Conectividad', 
    content: '¿Con qué dispositivos es compatible la tecnología Marvel?', 
    type: 'activity',
    options: ['Solo con iPhone', 'Solo con Android', 'Con cualquier dispositivo Bluetooth'],
    correct: 2
  },
  { 
    id: 19, 
    title: 'Mejoras Futuras', 
    content: 'Tu implante mejora con el tiempo sin cirugía.', 
    type: 'info', 
    details: 'Las futuras mejoras en procesamiento de sonido se realizan actualizando el procesador externo o el software, sin tocar el implante interno.',
    video: 'https://www.youtube.com/embed/p1QZ2r6C5Wc?autoplay=0' /* Future upgrades */
  },
  { 
    id: 20, 
    title: 'Meta', 
    content: '¡Felicidades! Has completado el curso de candidatos 2025.', 
    type: 'end',
    image: 'https://www.advancedbionics.com/etc/designs/advancedbionics/oneTrust/consent/0b244e5d-807c-4858-9cbf-ac3ccd6e3110-test/66c9b089-91d5-4e9c-b0e9-fa3b7c6ab7a3/logos/9f5a031d-4b04-44da-8919-804ac18f6a98/077bd732-7263-4b94-b07e-84843d72928e/03d00277-2988-492b-af21-b3ca06c08775/AB_OneTrust_Logo_Color.jpg'
  }
];

const GameBoard: React.FC<GameBoardProps> = ({ userData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [failedCurrentQuiz, setFailedCurrentQuiz] = useState(false);
  const [puzzleState, setPuzzleState] = useState<number[]>([]);
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#fcd34d', '#ffffff']
    });
  };



  const handleSquareClick = (index: number) => {
    if (index <= maxStepReached) {
      setCurrentStep(index);
      setShowModal(true);
      soundManager.playPop();
    }
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    soundManager.playPop();
    if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (direction === 'next' && currentStep < steps.length - 1) {
      // Avanzar de manera secuencial sin dado
      setFailedCurrentQuiz(false);
      setPuzzleState([]);
      const nextStep = currentStep + 1;
      if (nextStep > maxStepReached) {
        setMaxStepReached(nextStep);
      }
      setCurrentStep(nextStep);
      
      if (nextStep === steps.length - 1) {
        triggerConfetti();
        soundManager.playSuccess();
      }
    }
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    if (selectedIndex === steps[currentStep].correct) {
      if (!failedCurrentQuiz && currentStep === maxStepReached) {
        setStars(prev => prev + 1);
        triggerConfetti();
        soundManager.playSuccess();
      }
      setTimeout(() => {
        // Auto-advance on correct answer
        navigateModal('next');
      }, 1500);
    } else {
      setFailedCurrentQuiz(true);
      soundManager.playError();
      const buttons = document.querySelectorAll('.quiz-btn');
      buttons[selectedIndex].classList.add('error-shake');
      setTimeout(() => buttons[selectedIndex].classList.remove('error-shake'), 500);
    }
  };

  const handlePuzzleClick = (pieceId: number) => {
    if (puzzleState.includes(pieceId)) return;
    
    soundManager.playPop();
    const newPuzzleState = [...puzzleState, pieceId];
    setPuzzleState(newPuzzleState);
    
    // Check if puzzle is complete
    if (newPuzzleState.length === 4) {
      const isCorrect = newPuzzleState.every((val, index) => val === index + 1);
      if (isCorrect) {
        soundManager.playSuccess();
        if (!failedCurrentQuiz && currentStep === maxStepReached) {
          setStars(prev => prev + 1);
          triggerConfetti();
        }
        setTimeout(() => {
          navigateModal('next');
        }, 1500);
      } else {
        setFailedCurrentQuiz(true);
        soundManager.playError();
        setTimeout(() => setPuzzleState([]), 1000);
      }
    }
  };

  const generateCertificate = () => {
    soundManager.playSuccess();
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFillColor(0, 86, 145); // AB Blue
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 277, 190, 'F');
    
    doc.setTextColor(0, 86, 145);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificado de Capacitacion', 148.5, 50, { align: 'center' });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text('Advanced Bionics otorga el presente diploma a:', 148.5, 80, { align: 'center' });
    
    doc.setTextColor(242, 109, 33); // AB Orange
    doc.setFontSize(35);
    doc.setFont('helvetica', 'bold');
    doc.text(`${userData?.childName || 'Familia'}`, 148.5, 110, { align: 'center' });
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(`Por completar el "Camino al Implante Coclear" con ${stars} estrellas de excelencia.`, 148.5, 140, { align: 'center' });
    
    doc.setFontSize(12);
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Fecha: ${date}`, 148.5, 170, { align: 'center' });
    
    doc.save(`Certificado_AB_${userData?.childName || 'Familia'}.pdf`);
  };

  return (
    <div className="game-container relative">
      
      <div className="game-header glass">
        <div className="player-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="https://www.advancedbionics.com/etc/designs/advancedbionics/oneTrust/consent/0b244e5d-807c-4858-9cbf-ac3ccd6e3110-test/66c9b089-91d5-4e9c-b0e9-fa3b7c6ab7a3/logos/9f5a031d-4b04-44da-8919-804ac18f6a98/077bd732-7263-4b94-b07e-84843d72928e/03d00277-2988-492b-af21-b3ca06c08775/AB_OneTrust_Logo_Color.jpg" 
            alt="Advanced Bionics Logo" 
            style={{ height: '40px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle className="text-success" />
            <span>Acompañando a: <strong>{userData?.childName || 'Tu hijo'}</strong></span>
          </div>
        </div>
        <div className="score-board">
          <div className="stars-container">
            <Star className="text-warning fill-warning" />
            <span className="star-count">{stars}</span>
          </div>
        </div>
        <div className="progress-bar-wrapper">
          <div 
            className="progress-fill" 
            style={{ width: `${(maxStepReached / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="board-layout">
        <div className="path">
          {steps.map((step, index) => {
            const isCompleted = index < maxStepReached;
            const isActive = index === currentStep;
            const isLocked = index > maxStepReached;
            
            return (
              <div key={step.id} className={`square-wrapper ${isCompleted ? 'line-completed' : ''}`}>
                <div 
                  className={`square ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleSquareClick(index)}
                >
                  {isLocked ? (
                    <Lock className="lock-icon" size={24} />
                  ) : (
                    <>
                      <span className="square-number">{step.id}</span>
                      <span className="step-label">{step.title}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sidebar">
          <div className="controls glass" style={{ textAlign: 'center' }}>
            <h3 className="text-xl font-bold text-primary mb-2">Tu Progreso</h3>
            <p className="text-md text-text-muted mb-4">Módulo {maxStepReached + 1} de {steps.length}</p>
            <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <motion.div 
                style={{ height: '100%', background: 'var(--primary)', borderRadius: '6px' }}
                initial={{ width: 0 }}
                animate={{ width: `${((maxStepReached + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {maxStepReached < steps.length - 1 && (
              <button 
                onClick={() => {
                  setShowModal(true);
                  if (currentStep < maxStepReached) {
                    setCurrentStep(maxStepReached);
                  }
                }} 
                className="btn-primary w-full mt-6"
              >
                Continuar <ChevronRight />
              </button>
            )}
          </div>

          <div className="locutor-widget">
            <div className="widget-header">
              <div className="live-dot"></div>
              Transmisión en Vivo
            </div>
            <iframe 
              width="100%" 
              height="260" 
              src="https://www.youtube.com/embed/Pj15b6-K03s?autoplay=1&mute=1&loop=1&playlist=Pj15b6-K03s" 
              title="Locutor" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if(e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div 
              className="glass modal-content"
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className="modal-header">
                {steps[currentStep].type === 'end' ? <CheckCircle className="text-success" size={32} /> : <Zap className="text-accent" />}
                <h3>{steps[currentStep].title}</h3>
              </div>
              <div className="modal-body">
                {steps[currentStep].image && !steps[currentStep].video && (
                  <div className="step-image-container">
                    <img src={steps[currentStep].image} alt={steps[currentStep].title} className="step-image" />
                  </div>
                )}
                
                {steps[currentStep].interactive3d && (
                  <div className="step-3d-container mb-4" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: '#f8fafc' }}>
                    <div className="text-center p-2 text-xs font-semibold text-primary bg-blue-50 border-b border-blue-100">
                      👆 Arrastra para rotar | 🖱️ Scroll para hacer Zoom
                    </div>
                    <iframe 
                      width="100%" 
                      height="300" 
                      src={`https://sketchfab.com/models/${steps[currentStep].interactive3d}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0&ui_theme=dark`}
                      title={steps[currentStep].title}
                      frameBorder="0" 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {steps[currentStep].video && (
                  <div className="step-video-container mb-4" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <iframe 
                      width="100%" 
                      height="250" 
                      src={steps[currentStep].video} 
                      title={steps[currentStep].title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <p>{steps[currentStep].content}</p>
                
                {steps[currentStep].type === 'end' && (
                  <div className="summary-box">
                    <h4>¡Resumen del Viaje!</h4>
                    <p>Has aprendido sobre el implante <strong>HiRes Ultra 3D</strong>, la tecnología <strong>Marvel</strong> y cómo vivir una vida activa sin límites.</p>
                    <p>Conseguiste <strong>{stars} estrellas</strong> en los retos.</p>
                    <p>Nos pondremos en contacto con el correo <strong>{userData?.email}</strong> para darte más información.</p>
                    
                    <button 
                      onClick={generateCertificate}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                      style={{ padding: '1rem', fontSize: '1.1rem' }}
                    >
                      <Download size={20} />
                      Descargar Certificado Oficial
                    </button>
                  </div>
                )}
                
                {steps[currentStep].type === 'activity' && (
                  <div className="quiz-options">
                    {steps[currentStep].options?.map((opt: string, i: number) => (
                      <button 
                        key={i} 
                        className={`quiz-btn ${failedCurrentQuiz && i !== steps[currentStep].correct ? 'disabled' : ''}`}
                        onClick={() => handleQuizAnswer(i)}
                      >
                        {opt}
                      </button>
                    ))}
                    {failedCurrentQuiz && <p className="error-msg">Intenta de nuevo para avanzar.</p>}
                  </div>
                )}

                {steps[currentStep].type === 'puzzle' && (
                  <div className="puzzle-container">
                    <p className="puzzle-instruction text-accent mb-4">Haz clic en las piezas en el orden correcto:</p>
                    <div className="puzzle-pieces">
                      {/* Randomize initial display order, but for simplicity we keep it static or shuffle */}
                      {[3, 1, 4, 2].map(id => {
                        const piece = steps[currentStep].puzzlePieces?.find((p: any) => p.id === id);
                        const isSelected = puzzleState.includes(id);
                        const selectionIndex = puzzleState.indexOf(id) + 1;
                        
                        return piece ? (
                          <button 
                            key={id}
                            className={`puzzle-piece ${isSelected ? 'selected' : ''}`}
                            onClick={() => handlePuzzleClick(id)}
                            disabled={isSelected || (currentStep < maxStepReached)}
                          >
                            {isSelected && <span className="selection-badge">{selectionIndex}</span>}
                            {piece.text.substring(3)} {/* Remove the number from the text for the puzzle */}
                          </button>
                        ) : null;
                      })}
                    </div>
                    {failedCurrentQuiz && <p className="error-msg">Orden incorrecto. ¡Inténtalo de nuevo!</p>}
                    {puzzleState.length === 4 && !failedCurrentQuiz && <p className="success-msg text-success mt-4">¡Rompecabezas Completado!</p>}
                  </div>
                )}

                {steps[currentStep].type === 'audio-compare' && (
                  <div className="audio-compare-container">
                    <div className="audio-card noisy">
                      <h4>Sin AutoSense OS</h4>
                      <p>Ruido de fondo elevado, difícil de entender.</p>
                      <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" className="audio-player"></audio>
                    </div>
                    <div className="audio-card clear">
                      <h4>Con AutoSense OS <Zap size={16} /></h4>
                      <p>Ruido filtrado, voz clara y nítida.</p>
                      <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" className="audio-player"></audio>
                    </div>
                  </div>
                )}

                {steps[currentStep].type === 'info' && steps[currentStep].details && (
                  <div className="details-box">
                    <Info size={16} />
                    <p>{steps[currentStep].details}</p>
                  </div>
                )}

              </div>
              
              <div className="modal-footer">
                <div className="modal-nav">
                  <button 
                    onClick={() => navigateModal('prev')} 
                    disabled={currentStep === 0}
                    className="nav-btn"
                  >
                    &larr; Atrás
                  </button>
                  <span className="step-indicator">{currentStep + 1} / {steps.length}</span>
                  <button 
                    onClick={() => navigateModal('next')} 
                    disabled={currentStep === steps.length - 1}
                    className="nav-btn"
                  >
                    Siguiente &rarr;
                  </button>
                </div>
                
                {steps[currentStep].type !== 'activity' && steps[currentStep].type !== 'puzzle' && (
                  <button onClick={() => setShowModal(false)} className="btn-primary w-full mt-4">
                    {currentStep < maxStepReached ? 'Cerrar' : 'Continuar Viaje'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GameBoard;
