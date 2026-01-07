def quick_sort(arr, key=lambda x: x, reverse=False):
    
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    pivot_val = key(pivot)
    
    left = [x for x in arr if (key(x) < pivot_val if not reverse else key(x) > pivot_val)]
    middle = [x for x in arr if key(x) == pivot_val]
    right = [x for x in arr if (key(x) > pivot_val if not reverse else key(x) < pivot_val)]
    
    return quick_sort(left, key, reverse) + middle + quick_sort(right, key, reverse)

def binary_search(arr, target, key=lambda x: x):
    
    if not target:
        return []
        
    low = 0
    high = len(arr) - 1
    target = target.lower()
    
    first_match = -1
    
    # Binary search to find ANY match
    while low <= high:
        mid = (low + high) // 2
        mid_val = key(arr[mid]).lower()
        
        if mid_val.startswith(target):
            first_match = mid
            break
        elif mid_val < target:
            low = mid + 1
        else:
            high = mid - 1
            
    if first_match == -1:
        return []
        
    # Expand results to include all contiguous matches (prefix-based range)
    start = first_match
    while start > 0 and key(arr[start-1]).lower().startswith(target):
        start -= 1
        
    end = first_match
    while end < len(arr) - 1 and key(arr[end+1]).lower().startswith(target):
        end += 1
        
    return arr[start:end+1]

def get_top_n_gainers(arr, n=3):
    
    if not arr:
        return []
    
    # We'll use a simple selection-based top-N for demonstration if Heap is overhead,
    # but let's do a basic heap-sort style selection for top N.
    
    # Extract change values
    def get_change_val(item):
        # Handle string percentage like "+2.50%"
        try:
            return float(item['change'].replace('%', '').replace('+', ''))
        except:
            return 0.0

    # For small N, we can just sort and slice, but to show DSA:
    sorted_arr = quick_sort(arr, key=get_change_val, reverse=True)
    return sorted_arr[:n]

def merge_sort(arr, key=lambda x: x, reverse=False):
    
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], key, reverse)
    right = merge_sort(arr[mid:], key, reverse)
    
    return _merge(left, right, key, reverse)

def _merge(left, right, key, reverse):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if not reverse:
            if key(left[i]) <= key(right[j]):
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        else:
            if key(left[i]) >= key(right[j]):
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

class DecisionTree:
    
    def __init__(self, rules):
        self.rules = rules # Nested dict representing the tree

    def predict(self, features):
        node = self.rules
        while isinstance(node, dict):
            # Each dict node has a 'feature', 'threshold', and 'children' (left/right)
            feature = node['feature']
            val = float(features.get(feature, 0))
            if val <= node['threshold']:
                node = node['left']
            else:
                node = node['right']
        return node

def kmp_search(text, pattern):
    
    if not pattern: return True
    
    text = text.lower()
    pattern = pattern.lower()
    
    # Precompute prefix function
    m = len(pattern)
    pi = [0] * m
    k = 0
    for q in range(1, m):
        while k > 0 and pattern[k] != pattern[q]:
            k = pi[k-1]
        if pattern[k] == pattern[q]:
            k += 1
        pi[q] = k
        
    # Search
    q = 0
    for i in range(len(text)):
        while q > 0 and pattern[q] != text[i]:
            q = pi[q-1]
        if pattern[q] == text[i]:
            q += 1
        if q == m:
            return True
    return False

class CircularQueue:
    
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.head = 0
        self.tail = 0
        self.count = 0

    def enqueue(self, item):
        self.queue[self.tail] = item
        self.tail = (self.tail + 1) % self.size
        if self.count < self.size:
            self.count += 1
        else:
            self.head = (self.head + 1) % self.size

    def get_all(self):
        result = []
        temp_head = self.head
        for _ in range(self.count):
            result.append(self.queue[temp_head])
            temp_head = (temp_head + 1) % self.size
        return result[::-1] # Return most recent first

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    
    def __init__(self, max_size=10):
        self.head = None
        self.max_size = max_size
        self.size = 0

    def add(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
        
        if self.size > self.max_size:
            # Remove last node
            current = self.head
            for _ in range(self.max_size - 1):
                current = current.next
            current.next = None
            self.size = self.max_size

    def get_all(self):
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result

class Stack:
    """Manual Stack for Undo/Redo."""
    def __init__(self):
        self.items = []
    def push(self, item): self.items.append(item)
    def pop(self): return self.items.pop() if self.items else None
    def is_empty(self): return len(self.items) == 0
    def peek(self): return self.items[-1] if self.items else None

class HashTable:
    """Manual Hash Table for User Caching."""
    def __init__(self, size=100):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in str(key)) % self.size

    def set(self, key, value):
        h = self._hash(key)
        for i, (k, v) in enumerate(self.table[h]):
            if k == key:
                self.table[h][i] = (key, value)
                return
        self.table[h].append((key, value))

    def get(self, key):
        h = self._hash(key)
        for k, v in self.table[h]:
            if k == key: return v
        return None

class Graph:
    """Manual Graph for Network Topology."""
    def __init__(self):
        self.adj = {}

    @property
    def nodes(self):
        return list(self.adj.keys())

    def add_edge(self, u, v, weight=1):
        if u not in self.adj: self.adj[u] = []
        if v not in self.adj: self.adj[v] = []
        self.adj[u].append((v, weight))
        self.adj[v].append((u, weight)) # Undirected

    def bfs(self, start):
        visited = set()
        queue = [start]
        result = []
        visited.add(start)
        while queue:
            u = queue.pop(0)
            result.append(u)
            for v, w in self.adj.get(u, []):
                if v not in visited:
                    visited.add(v)
                    queue.append(v)
        return result

class LRUCache:
    """Manual LRU Cache for Auth sessions."""
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {} # key -> Node
        self.head = Node(None) # Dummy head
        self.tail = Node(None) # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev = node.prev
        next = node.next
        prev.next = next
        next.prev = prev

    def _add(self, node):
        next = self.head.next
        self.head.next = node
        node.prev = self.head
        node.next = next
        next.prev = node

    def get(self, key):
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.data
        return None

    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(value)
        node.key = key # For deletion
        self.cache[key] = node
        self._add(node)
        if len(self.cache) > self.capacity:
            # remove from tail
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]

class MinHeap:
    
    def __init__(self):
        self.heap = []

    def push(self, item, priority):
        self.heap.append((priority, item))
        self._bubble_up(len(self.heap) - 1)

    def pop(self):
        if not self.heap: return None
        if len(self.heap) == 1: return self.heap.pop()[1]
        
        root = self.heap[0][1]
        self.heap[0] = self.heap.pop()
        self._bubble_down(0)
        return root

    def _bubble_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index][0] < self.heap[parent][0]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._bubble_up(parent)

    def _bubble_down(self, index):
        left = 2 * index + 1
        right = 2 * index + 2
        smallest = index
        
        if left < len(self.heap) and self.heap[left][0] < self.heap[smallest][0]:
            smallest = left
        if right < len(self.heap) and self.heap[right][0] < self.heap[smallest][0]:
            smallest = right
            
        if smallest != index:
            self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
            self._bubble_down(smallest)

# Shared DSA objects for cross-blueprint communication
user_cache = HashTable(size=100)
admin_stack = Stack()



