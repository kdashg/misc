#include <cstdio>
#include <cstdint>
#include <limits>       // std::numeric_limits
#include <cassert>

template<typename To, typename From>
To narrow_cast_t(const From val) {
  assert(val >= std::numeric_limits<To>::min() &&
         val <= std::numeric_limits<To>::max());
  return static_cast<To>(val);
}

namespace detail {

template<typename T>
class NarrowCastClass final {
  const T val;

public:
  explicit NarrowCastClass(const T rhs) : val(rhs) {}

  template<typename U>
  operator U() const {
    return narrow_cast_t<U>(val);
  }
};

} // namespace detail

template<typename T>
inline detail::NarrowCastClass<T> narrow_cast(const T val) {
  return detail::NarrowCastClass<T>(val);
}

void foo(int8_t) {}
char bar(int64_t x) {
  return narrow_cast(x);
}

int main() {
  uint64_t x = 300;
  uint32_t y = narrow_cast(x);
  printf("u32: %u\n", y);
  bar(x);
  foo(x);
  uint8_t z = narrow_cast(x);
  printf("u8: %u\n", z);
  return 0;
}

