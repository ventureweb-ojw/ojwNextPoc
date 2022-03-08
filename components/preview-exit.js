

export function PreviewExit ({
  slug
}) {
    return (
    <div
    style={{
      background: 'gainsboro',
      padding: '4px 10px',
      textAlign: 'right'
    }}
    >
      <a
      href={'/api/exit-preview?slug=/experiences/'+slug}
      style={{
        display: 'inline-block',
        padding: '4px',
        fontSize: '10px',
        textTransform: 'uppercase',
        background: 'white',
        color: 'black',
      }}
      >
      exit preview
      </a>
    </div>
    )
}