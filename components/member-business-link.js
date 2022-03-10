export function MemberBusinessLink ({
    children, 
    value
  }) {
      return (
          <span style={{ textDecoration: 'underline' }}>{ value.reference }</span>
      )
  }