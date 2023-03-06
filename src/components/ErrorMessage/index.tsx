import './ErrorMessage.css'

interface ErrorMessageProps {
  readonly text: string
  readonly className?: string
}

export function ErrorMessage({ text, className }: ErrorMessageProps) {
  return (
    <div className={`errorMessage ${className}`}>
      <span>{text}</span>
    </div>
  )
}
