import React from 'react';

class Masonry extends React.Component {
  constructor(props) {
    super(props);

    let state = {};

    for (let i = 0; i < this.props.columns; i++) state[`col-${i}`] = [];

    this.state = state;

    this.container = React.createRef();
  }

  componentDidMount() {
    const tiles = this.getTiles(this.props);

    this.addTiles(tiles);
  }

  componentDidUpdate(prevProps, prevState, nextProps) {
    try {
      if (
        prevProps.columns !== this.props.columns ||
        !this.areArraysEqual(prevProps.elements, this.props.elements) ||
        (prevProps.children || []).length !==
          (this.props.children || []).length ||
        !(prevProps.children || []).every((child, i) => {
          return prevProps.children[i].key === this.props.children[i].key;
        })
      ) {
        let newState = {};
        for (let i = 0; i < prevProps.columns; i++) {
          newState[`col-${i}`] = [];
        }
        this.setState(newState);

        const tiles = this.getTiles(prevProps);

        this.addTiles(tiles);
      }
    } catch (error) {
      console.warn(error.message);
    }
  }

  cancel = () => {};

  areArraysEqual = (a = [], b = []) => {
    return (
      a.length === b.length &&
      a.sort().every(function (value, index) {
        return value === b.sort()[index];
      })
    );
  };

  getColumns = () => {
    let columns = [];

    this.container.current.childNodes.forEach((node) => {
      if (node.className.includes('react-masonry-column')) {
        columns.push(node);
      }
    });

    return columns;
  };

  getShortestColumn = () => {
    const columns = this.getColumns();

    let shortestColumn = 0;
    columns.forEach((column, index) => {
      if (column.offsetHeight < columns[shortestColumn].offsetHeight) {
        shortestColumn = index;
      }
    });

    return shortestColumn;
  };

  getTallestColumn = () => {
	  const columns = this.getColumns();

	  let tallestColumn = 0;
	  columns.forEach((column, index) => {
		  if (column.offsetHeight > columns[tallestColumn].offsetHeight) {
			  tallestColumn = index;
		  }
	  });

	  return tallestColumn;
  }

  getElements = (element) => {
    if (!element) {
      return [];
    }

    if (element.type === 'img') {
      return [element.props.src];
    }

    let children = element.props ? element.props.children : false;

    if (children) {
      let elements = [];
      React.Children.forEach(children, (child) => {
        elements = elements.concat(this.getElements(child));
      });
      return elements;
    }

    return [];
  };

  loadElements = (elements) => {
    const data = [];

    elements.forEach((src) => {
      data.push(
        new Promise((resolve, reject) => {
          let image = new Image();

          image.onload = resolve;
          image.onerror = reject;
          image.src = src;

          this.cancel = function () {
            image.src = '';
          };
        }),
      );
    });

    return Promise.all(data);
  };

  getTiles = (props) => {
    let tiles = [];

    if (props.elements) {
      tiles = props.elements.map((image, index) => {
        return (
          <img
            src={image}
            alt={image}
            key={`img-${index}${Date.now()}`}
            style={{
              border: '2px solid transparent',
              boxSizing: 'border-box',
            }}
          />
        );
      });
    } else if (props.children) {
      tiles = React.Children.map(props.children, (child, index) => {
        const props = { key: `child-${index}${Date.now()}` };

        if (React.isValidElement(child)) {
          return React.cloneElement(child, props);
        }

        return child;
      });
    } else {
      console.warn('No elements were passed into react-masonry');
    }

    return tiles;
  };

  addTiles = (tiles) => {
    tiles.forEach((tile, index) => {
      if (!tile) {
        return;
      }

      let style = {};

      let animate = this.props.hasOwnProperty('animate')
        ? this.props.animate
        : true;
      if (animate) {
        style.animation = 'fadeIn 1s ease-in';
      }

      style.order = index;

      if (tile && tile.props && tile.props.style) {
        style = Object.assign({}, tile.props.style, style);
      }
      tile = React.cloneElement(tile, { style });

      const elements = this.getElements(tile);
      this.loadElements(elements)
        .then(() => {
          const shortestColumn = this.getShortestColumn();

          this.setState({
            [`col-${shortestColumn}`]: this.state[
              `col-${shortestColumn}`
            ].concat([tile]),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  render() {
    let columns = [];

    const width = this.props.hasOwnProperty('width')
      ? this.props.width
      : '100%';
    const height = this.props.hasOwnProperty('height')
      ? this.props.height
      : this.props.scrollable
      ? '500px'
      : 'auto';
    const overflowY = this.props.scrollable ? 'scroll' : 'hidden';

    for (let i = 0; i < this.props.columns; i++) {
      columns.push(
        <div
          style={{
            width: 100 / this.props.columns + '%',
            display: 'flex',
            flexDirection: 'column',
            float: 'left',
          }}
          className="react-masonry-column"
          key={`col-${i}`}
        >
          {Object.values(this.state[`col-${i}`])}
        </div>,
      );
    }

    const styles = `
			.react-masonry-column * {
				width: 100%;
				box-sizing: border-box;
			}

			@keyframes fadeIn {
				from {
					opacity: 0;
				}

				to {
					opacity: 1;
				}
			}
		`;

    return (
      <div
        ref={this.container}
        style={{
          width: width,
          height: height,
          overflowX: 'hidden',
          overflowY: overflowY,
          margin: 'auto',
        }}
        className={this.props.className}
      >
        <style>{styles}</style>
        {columns}
      </div>
    );
  }
}

export default Masonry;
