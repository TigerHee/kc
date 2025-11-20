export default function resolveOnChange(target, e, onChange, targetValue) {
  if (!onChange) {
    return;
  }
  let event = e;

  if (e.type === 'click') {
    const currentTarget = target.cloneNode(true);
    event = Object.create(e, {
      target: { value: currentTarget },
      currentTarget: { value: currentTarget },
    });

    currentTarget.value = '';
    onChange(event);
    return;
  }

  if (targetValue !== undefined) {
    event = Object.create(e, {
      target: { value: target },
      currentTarget: { value: target },
    });

    target.value = targetValue;
    onChange(event);
    return;
  }
  onChange(event);
}
