import { ProductReview } from '../../types';
import { productService } from '../products/ProductService';

export interface CreateReviewPayload {
  productId: string;
  customerName?: string;
  userName?: string;
  rating: number;
  comment: string;
  [key: string]: any;
}

export interface IReviewService {
  getProductReviews(productId: string): Promise<ProductReview[]>;
  addReview(productId: string, review: Omit<ProductReview, 'id' | 'date'>): Promise<ProductReview>;
  createReview(productIdOrPayload: string | CreateReviewPayload, review?: Omit<ProductReview, 'id' | 'date'>): Promise<ProductReview>;
}

class ReviewServiceImpl implements IReviewService {
  public async getProductReviews(productId: string): Promise<ProductReview[]> {
    const product = await productService.getProductById(productId);
    return product?.reviewsList || [];
  }

  public async addReview(productId: string, review: Omit<ProductReview, 'id' | 'date'>): Promise<ProductReview> {
    const product = await productService.getProductById(productId);
    if (!product) throw new Error(`Product with id ${productId} not found`);

    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    const updatedReviews = [newReview, ...(product.reviewsList || [])];
    const avgRating = Number(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    await productService.updateProduct(productId, {
      reviewsList: updatedReviews,
      reviewCount: updatedReviews.length,
      rating: avgRating
    });

    return newReview;
  }

  public async createReview(productIdOrPayload: string | CreateReviewPayload, review?: Omit<ProductReview, 'id' | 'date'>): Promise<ProductReview> {
    if (typeof productIdOrPayload === 'string') {
      if (!review) throw new Error('Review data required');
      return this.addReview(productIdOrPayload, review);
    }
    const payload = productIdOrPayload;
    return this.addReview(payload.productId, {
      userName: payload.customerName || payload.userName || 'Verified Shopper',
      rating: payload.rating,
      comment: payload.comment,
      verifiedPurchase: payload.isVerifiedPurchase ?? false
    });
  }
}

export const reviewService: IReviewService = new ReviewServiceImpl();
