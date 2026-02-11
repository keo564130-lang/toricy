import { motion } from 'framer-motion'
import './StickerPicker.css'

interface StickerPickerProps {
  onSelect: (stickerId: string, stickerUrl: string) => void
  onClose: () => void
}

// Примеры анимированных стикеров (в реальном приложении загружать с сервера)
const STICKER_PACKS = [
  {
    id: 'pack1',
    name: 'Эмоции',
    stickers: [
      { id: 's1', url: '/stickers/happy.gif', preview: '😊' },
      { id: 's2', url: '/stickers/love.gif', preview: '❤️' },
      { id: 's3', url: '/stickers/laugh.gif', preview: '😂' },
      { id: 's4', url: '/stickers/cool.gif', preview: '😎' },
      { id: 's5', url: '/stickers/sad.gif', preview: '😢' },
      { id: 's6', url: '/stickers/angry.gif', preview: '😠' },
    ]
  },
  {
    id: 'pack2',
    name: 'Жесты',
    stickers: [
      { id: 's7', url: '/stickers/thumbs-up.gif', preview: '👍' },
      { id: 's8', url: '/stickers/clap.gif', preview: '👏' },
      { id: 's9', url: '/stickers/wave.gif', preview: '👋' },
      { id: 's10', url: '/stickers/ok.gif', preview: '👌' },
    ]
  }
]

export default function StickerPicker({ onSelect, onClose }: StickerPickerProps) {
  return (
    <motion.div
      className="sticker-picker-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sticker-picker card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticker-picker-header">
          <h3>Стикеры</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="sticker-packs">
          {STICKER_PACKS.map(pack => (
            <div key={pack.id} className="sticker-pack">
              <h4>{pack.name}</h4>
              <div className="stickers-grid">
                {pack.stickers.map(sticker => (
                  <motion.button
                    key={sticker.id}
                    className="sticker-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSelect(sticker.id, sticker.url)
                      onClose()
                    }}
                  >
                    <span className="sticker-preview">{sticker.preview}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
