import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd'
import BoardContext from '../Board/context'

import { Container, Label } from './styles';

function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext)

  const [{ isDragging }, dragRef] = useDrag({ 
    item: { type: 'CARD', index, listIndex},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({ 
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index
      const targetIndex = index

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      // Handle cards next to each other (they are not supposed to move)
      if ((draggedIndex < targetIndex && draggedTop < targetCenter) || // when im trying to put the item above before the second one, which is his current position  
      (draggedIndex > targetIndex && draggedTop > targetCenter)) { // same but with the item bellow
        return;
      }
      console.log(targetListIndex)
      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex
      item.listIndex = targetListIndex
    }
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label}/>)}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt=""/>}
    </Container>
  );
}

export default Card;