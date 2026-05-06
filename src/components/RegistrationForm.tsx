import React, { useState } from 'react';
import { User, Mail, MessageSquare, Baby, ArrowRight } from 'lucide-react';

interface RegistrationFormProps {
  onComplete: (data: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    whatsapp: '',
    childName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="registration-wrapper">
      <div className="glass registration-card">
        <header className="registration-header">
          <img 
            src="https://www.advancedbionics.com/etc/designs/advancedbionics/oneTrust/consent/0b244e5d-807c-4858-9cbf-ac3ccd6e3110-test/66c9b089-91d5-4e9c-b0e9-fa3b7c6ab7a3/logos/9f5a031d-4b04-44da-8919-804ac18f6a98/077bd732-7263-4b94-b07e-84843d72928e/03d00277-2988-492b-af21-b3ca06c08775/AB_OneTrust_Logo_Color.jpg" 
            alt="Advanced Bionics Logo" 
            className="ab-logo" 
          />
          <h1>Camino al Implante</h1>
          <p>Comienza el viaje de aprendizaje para tu familia</p>
        </header>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-group">
            <label><User size={18} /> Nombre del Padre/Madre</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. Juan Pérez"
              value={formData.parentName}
              onChange={(e) => setFormData({...formData, parentName: e.target.value})}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label><Mail size={18} /> Correo Electrónico</label>
              <input 
                type="email" 
                required 
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label><MessageSquare size={18} /> WhatsApp</label>
              <input 
                type="tel" 
                required 
                placeholder="+57 300..."
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group highlight">
            <label><Baby size={18} /> Nombre del Hijo o Pariente</label>
            <input 
              type="text" 
              required 
              placeholder="¿Quién recibirá el implante?"
              value={formData.childName}
              onChange={(e) => setFormData({...formData, childName: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary full-width">
            Empezar Experiencia <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
