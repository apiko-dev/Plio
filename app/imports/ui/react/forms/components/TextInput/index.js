import React, { PropTypes } from 'react';
import { compose, withState, lifecycle } from 'recompose';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

const enhance = compose(
  withState('internalValue', 'setInternalValue', property('value')),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        nextProps.setInternalValue(nextProps.value);
      }
    },
  }),
);

const TextInput = enhance(({
  value,
  internalValue,
  onChange,
  setInternalValue,
  reference = () => null,
  ...other,
}) => (
  <input
    type="text"
    value={internalValue}
    onChange={(e) => {
      setInternalValue(_.identity(e.target.value));
      
      return typeof onChange === 'function' && onChange(e);
    }}
    ref={reference}
    {...other}
  />
));

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  reference: PropTypes.func,
};

export default TextInput;