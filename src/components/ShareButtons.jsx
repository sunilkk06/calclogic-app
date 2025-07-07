import React, { useState } from 'react'

const ShareButtons = ({ title, description, customMessage }) => {
  const [copied, setCopied] = useState(false)
  
  const currentUrl = window.location.href
  const shareTitle = title || document.title
  const shareDescription = description || 'Check out this useful calculator from CalcLogic'
  const shareMessage = customMessage || `${shareTitle} - ${shareDescription}`

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n\n${currentUrl}`)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareMessage}\n\nCheck it out here: ${currentUrl}`)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = emailUrl
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="share-buttons">
      <h3 className="share-title">Share this calculator</h3>
      <div className="share-button-group">
        <button 
          onClick={handleWhatsAppShare}
          className="share-btn whatsapp-btn"
          aria-label="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
          <span>WhatsApp</span>
        </button>
        
        <button 
          onClick={handleEmailShare}
          className="share-btn email-btn"
          aria-label="Share via Email"
        >
          <i className="fas fa-envelope"></i>
          <span>Email</span>
        </button>
        
        <button 
          onClick={handleCopyLink}
          className="share-btn copy-btn"
          aria-label="Copy link"
        >
          <i className={copied ? "fas fa-check" : "fas fa-link"}></i>
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  )
}

export default ShareButtons
