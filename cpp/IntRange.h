#ifndef INT_RANGE_H_
#define INT_RANGE_H_

template<typename T>
class IntRangeT final {
  const T mBegin;
  const T mEnd;

public:
  IntRangeT(const T begin, const T end) : mBegin(begin), mEnd(end) { }

  struct IntIter final {
    T val;

    bool operator!=(const IntIter& rhs) const { return val != rhs.val; }
    T operator*() const { return val; }

    IntIter& operator++() {
      ++val;
      return *this;
    }
  };

  auto begin() const { return IntIter{ mBegin }; }
  auto end() const { return IntIter{ mEnd }; }
};

template<typename T, typename U>
inline IntRangeT<U> IntRange(const T begin, const U end) {
  return IntRangeT<U>(begin, end);
}

template<typename T>
inline IntRangeT<T> IntRange(const T end) {
  return IntRange(0, end);
}

#endif  // INT_RANGE_H_
