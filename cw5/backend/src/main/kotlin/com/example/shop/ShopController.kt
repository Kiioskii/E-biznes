package com.example.shop

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.atomic.AtomicLong

data class Product(
    val id: Long,
    val name: String,
    val description: String,
    val price: BigDecimal
)

data class CreateOrUpdateProductRequest(
    val name: String,
    val description: String,
    val price: BigDecimal
)

data class CartItem(
    val productId: Long,
    val quantity: Int
)

data class CartRequest(
    val items: List<CartItem>
)

data class PaymentRequest(
    val fullName: String,
    val email: String,
    val address: String,
    val amount: BigDecimal
)

data class ApiMessage(val message: String)

@RestController
@RequestMapping("/api")
class ShopController {

    private val idCounter = AtomicLong(8)
    private val products = CopyOnWriteArrayList(
        listOf(
            Product(1, "Laptop", "Lekki laptop 14 cali z 16 GB RAM i dyskiem SSD 512 GB.", BigDecimal("3999.99")),
            Product(2, "Mysz bezprzewodowa", "Ergonomiczna mysz Bluetooth z cichymi przyciskami.", BigDecimal("149.00")),
            Product(3, "Klawiatura mechaniczna", "Klawiatura RGB z przelacznikami tactile i hot-swap.", BigDecimal("329.50")),
            Product(4, "Monitor 27", "Monitor 27 cali IPS, rozdzielczosc 2560x1440, 144 Hz.", BigDecimal("1399.00")),
            Product(5, "Sluchawki", "Bezprzewodowe sluchawki z ANC i czasem pracy do 30 godzin.", BigDecimal("499.99")),
            Product(6, "Kamera internetowa", "Kamera Full HD z autofokusem do spotkan online.", BigDecimal("259.00")),
            Product(7, "Stacja dokujaca USB-C", "Stacja z HDMI, LAN i trzema portami USB 3.0.", BigDecimal("349.90")),
            Product(8, "Dysk zewnetrzny 1TB", "Szybki dysk SSD USB-C do backupu danych.", BigDecimal("419.00"))
        )
    )

    @GetMapping("/products")
    fun getProducts(): List<Product> = products.sortedBy { it.id }

    @GetMapping("/products/{id}")
    fun getProduct(@PathVariable id: Long): Product =
        products.find { it.id == id } ?: throw ProductNotFoundException(id)

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    fun createProduct(@RequestBody request: CreateOrUpdateProductRequest): Product {
        val newProduct = Product(
            id = idCounter.incrementAndGet(),
            name = request.name,
            description = request.description,
            price = request.price
        )
        products.add(newProduct)
        return newProduct
    }

    @PutMapping("/products/{id}")
    fun updateProduct(@PathVariable id: Long, @RequestBody request: CreateOrUpdateProductRequest): Product {
        val existing = products.find { it.id == id } ?: throw ProductNotFoundException(id)
        val updated = existing.copy(
            name = request.name,
            description = request.description,
            price = request.price
        )
        products.replaceAll { if (it.id == id) updated else it }
        return updated
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProduct(@PathVariable id: Long) {
        val removed = products.removeIf { it.id == id }
        if (!removed) throw ProductNotFoundException(id)
    }

    @PostMapping("/cart")
    fun saveCart(@RequestBody request: CartRequest): ApiMessage {
        val totalItems = request.items.sumOf { it.quantity }
        return ApiMessage("Koszyk zapisany. Liczba sztuk: $totalItems")
    }

    @PostMapping("/payments")
    fun processPayment(@RequestBody request: PaymentRequest): ApiMessage {
        return ApiMessage(
            "Platnosc przyjeta od ${request.fullName} na kwote ${request.amount} PLN. " +
                "Potwierdzenie wyslane na ${request.email}."
        )
    }
}

@ResponseStatus(HttpStatus.NOT_FOUND)
class ProductNotFoundException(id: Long) : RuntimeException("Produkt o id=$id nie istnieje")
