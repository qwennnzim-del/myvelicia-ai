import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
  textColor?: string;
  className?: string;
}

export const InfoCard: React.FC<CardProps> = ({ title, description, icon, gradient, onClick, textColor = "#004d2c", className }) => {
  return (
    <div className={`parent ${className || ''}`} onClick={onClick}>
      <div className="card" style={{ background: gradient }}>
        <div className="logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <span className="circle circle4"></span>
          <span className="circle circle5">
             {icon}
          </span>
        </div>
        <div className="glass"></div>
        <div className="content">
          <span className="title" style={{ color: textColor }}>{title}</span>
          <span className="text" style={{ color: textColor, opacity: 0.8 }}>{description}</span>
        </div>
        <div className="bottom">
          <div className="social-buttons-container">
            <button className="social-button">
              <Github size={15} className="svg" style={{ fill: textColor }} />
            </button>
            <button className="social-button">
               <Twitter size={15} className="svg" style={{ fill: textColor }} />
            </button>
            <button className="social-button">
               <Mail size={15} className="svg" style={{ fill: textColor }} />
            </button>
          </div>
          <div className="view-more">
            <button className="view-more-button" style={{ color: textColor }}>View more</button>
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: textColor }}>
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};