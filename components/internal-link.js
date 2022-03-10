export function InternalLink ({
    children, 
    value
  }) {

    //get the path based on the internal link reference type
    //@TODO - abstract
    const path = (() => {
        switch(value.entity._type) {
            case 'experience': 
                return '/experiences/' + value.slug.current
            default: 
                return value.slug.current
        }
    })();
      
    //return the link
    return (
        <a 
        style={{ textDecoration: 'underline' }}
        rel='follow'
        href={path}
        >
            { children }
        </a>
    )
  }