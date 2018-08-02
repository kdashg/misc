#pragma once

struct CopyRingBuffer
{
   uint8_t* const _data;
   const uint64_t _data_len;

   void Read(uint64_t offset, uint8_t* dest, uint64_t dest_size) const;
   void Write(uint64_t offset, const uint8_t* src, uint64_t src_size);
};

//#include "CopyRingBuffer.h"

#include <algorithm>
#include <cstring>

#define UNLIKELY(X) (X)

void
CopyRingBuffer::Read(const uint64_t offset, uint8_t* const dest,
                     const uint64_t dest_size) const
{
   auto pos = offset;
   while (UNLIKELY( pos >= _data_len)) {
      pos -= _data_len;
   }

   auto itr = dest;
   auto bytes_left = dest_size;
   while (bytes_left) {
      const auto chunk_size = std::min<uint64_t>(bytes_left, _data_len - pos);
      memcpy(itr, _data + pos, chunk_size);
      pos = 0;
      bytes_left -= chunk_size;
      itr += chunk_size;
   }
}

void
CopyRingBuffer::Write(const uint64_t offset, const uint8_t* const src,
                      const uint64_t src_size)
{
   auto pos = offset;
   while (UNLIKELY( pos >= _data_len)) {
      pos -= _data_len;
   }

   auto itr = src;
   auto bytes_left = src_size;
   while (bytes_left) {
      const auto chunk_size = std::min<uint64_t>(bytes_left, _data_len - pos);
      memcpy(_data + pos, itr, chunk_size);
      pos = 0;
      bytes_left -= chunk_size;
      itr += chunk_size;
   }
}

#undef UNLIKELY
